import { Booking } from '../models/booking.js'
import { Rooms } from '../models/rooms.js'

// add
export const addBooking = async (roomId, bookingData) => {
	try {
		// 1. Проверяем существование комнаты
		const room = await Rooms.findById(roomId)
		if (!room) {
			throw new Error('Room not found')
		}

		// 2. Проверяем доступность комнаты на эти даты
		const overlappingBooking = await Booking.findOne({
			room: roomId,
			$or: [
				{
					arrivalDate: { $lt: new Date(bookingData.departureDate) },
					departureDate: { $gt: new Date(bookingData.arrivalDate) },
				},
			],
		})

		if (overlappingBooking) {
			throw new Error('Room is already booked for these dates')
		}

		// 3. Проверяем количество гостей
		if (bookingData.guestsCount > room.maxGuests) {
			throw new Error(`This room can accommodate maximum ${room.maxGuests} guests`)
		}

		// 4. Создаем бронирование
		const newBooking = await Booking.create({
			...bookingData,
			arrivalDate: new Date(bookingData.arrivalDate),
			departureDate: new Date(bookingData.departureDate),
		})

		// 5. Добавляем бронирование в комнату
		await Rooms.findByIdAndUpdate(roomId, {
			$push: { bookings: newBooking._id }, // Сохраняем только ID!
		})

		return newBooking
	} catch (error) {
		console.error('Add booking error:', error)
		throw new Error(error.message || 'Failed to add booking')
	}
}

// bookingController
export const getUserBookings = async (req, res) => {
	try {
		const userId = req.user.id
		const now = new Date()
		// АКТИВНЫЕ брони (текущие и будущие)
		const activeBookings = await Booking.find({
			bookingOwner: userId,
			departureDate: { $gt: now }, // дата выезда БОЛЬШЕ текущей
		})
			.populate('room', 'title roomNumber price images')
			.sort({ arrivalDate: 1 }) // сортируем по дате заезда

		// ПРОШЕДШИЕ брони (история)
		const pastBookings = await Booking.find({
			bookingOwner: userId,
			departureDate: { $lte: now }, // дата выезда МЕНЬШЕ или РАВНА текущей
		})
			.populate('room', 'title roomNumber price images')
			.sort({ departureDate: -1 }) // сортируем по дате выезда (сначала новые)

		res.json({
			data: {
				active: activeBookings,
				past: pastBookings,
			},
		})
	} catch (error) {
		console.error('Get user bookings error:', error)
		res.status(500).json({
			error: 'Failed to get bookings',
		})
	}
}

// delete
export const cancelBooking = async (req, res) => {
	try {
		const userId = req.user.id
		const bookingId = req.params.id
		const now = new Date()

		// Находим бронирование
		const booking = await Booking.findOne({
			_id: bookingId,
			bookingOwner: userId,
		})

		if (!booking) {
			return res.status(404).json({
				success: false,
				error: 'Booking not found',
			})
		}

		// Проверяем, что бронь еще активна (дата выезда в будущем)
		if (booking.departureDate <= now) {
			return res.status(400).json({
				success: false,
				error: 'Cannot cancel past booking',
			})
		}

		// Проверяем, что до заезда больше 24 часов
		const timeUntilArrival = booking.arrivalDate - now
		const hoursUntilArrival = timeUntilArrival / (1000 * 60 * 60)

		if (hoursUntilArrival < 24) {
			return res.status(400).json({
				success: false,
				error: 'Cancellation must be at least 24 hours before arrival',
			})
		}

		// Удаляем бронирование
		await Booking.findByIdAndDelete(bookingId)

		// Удаляем из списка броней комнаты
		await Rooms.findByIdAndUpdate(booking.room, { $pull: { bookings: bookingId } })

		res.json({
			success: true,
			message: 'Booking cancelled successfully',
		})
	} catch (error) {
		console.error('Cancel booking error:', error)
		res.status(500).json({
			success: false,
			error: 'Failed to cancel booking',
		})
	}
}

// controllers/adminController.js
export const getAllBookings = async (req, res) => {
	try {
		const now = new Date()

		// Все активные брони
		const activeBookings = await Booking.find({
			departureDate: { $gt: now },
		})
			.populate('bookingOwner', 'name email')
			.populate('room', 'title roomNumber')
			.sort({ arrivalDate: 1 })

		// Все завершенные брони
		const completedBookings = await Booking.find({
			departureDate: { $lte: now },
		})
			.populate('bookingOwner', 'name email')
			.populate('room', 'title roomNumber')
			.sort({ departureDate: -1 })
			.limit(100) // ограничиваем историю

		res.json({
			success: true,
			data: {
				active: activeBookings,
				completed: completedBookings,
			},
		})
	} catch (error) {
		console.error('Get all bookings error:', error)
		res.status(500).json({
			success: false,
			error: 'Failed to get bookings',
		})
	}
}

// services/bookingService.js
export const isRoomAvailable = async (roomId, arrivalDate, departureDate) => {
	try {
		const now = new Date()
		const checkIn = new Date(arrivalDate)
		const checkOut = new Date(departureDate)

		// Нельзя бронировать в прошлом
		if (checkIn < now) {
			return {
				available: false,
				reason: 'Cannot book in the past',
			}
		}

		// Даты должны быть корректны
		if (checkOut <= checkIn) {
			return {
				available: false,
				reason: 'Departure date must be after arrival date',
			}
		}

		// Ищем пересекающиеся брони
		const overlappingBooking = await Booking.findOne({
			room: roomId,
			$or: [
				// Существующая бронь пересекается с новой
				{
					arrivalDate: { $lt: checkOut },
					departureDate: { $gt: checkIn },
				},
			],
		})

		if (overlappingBooking) {
			return {
				available: false,
				reason: 'Room already booked for these dates',
				conflictingBooking: overlappingBooking,
			}
		}

		return {
			available: true,
		}
	} catch (error) {
		console.error('Check availability error:', error)
		return {
			available: false,
			reason: 'Server error',
		}
	}
}

//get list of bookings room
