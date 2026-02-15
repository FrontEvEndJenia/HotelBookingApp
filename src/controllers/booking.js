import { Booking } from '../models/booking.js'
import { Rooms } from '../models/rooms.js'

export const addBooking = async (roomId, bookingData) => {
	try {
		const room = await Rooms.findById(roomId)
		if (!room) {
			throw new Error('Room not found')
		}

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

		if (bookingData.guestsCount > room.maxGuests) {
			throw new Error(`This room can accommodate maximum ${room.maxGuests} guests`)
		}

		const newBooking = await Booking.create({
			...bookingData,
			arrivalDate: new Date(bookingData.arrivalDate),
			departureDate: new Date(bookingData.departureDate),
		})

		await Rooms.findByIdAndUpdate(roomId, {
			$push: { bookings: newBooking._id },
		})

		return newBooking
	} catch (error) {
		console.error('Add booking error:', error)
		throw new Error(error.message || 'Failed to add booking')
	}
}

export const getUserBookings = async (req, res) => {
	try {
		const userId = req.user.id
		const now = new Date()

		const activeBookings = await Booking.find({
			bookingOwner: userId,
			departureDate: { $gt: now },
		})
			.populate('room', 'title roomNumber price images')
			.sort({ arrivalDate: 1 })

		const pastBookings = await Booking.find({
			bookingOwner: userId,
			departureDate: { $lte: now },
		})
			.populate('room', 'title roomNumber price images')
			.sort({ departureDate: -1 })

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

export const cancelBooking = async (req, res) => {
	try {
		const userId = req.user.id
		const bookingId = req.params.id
		const now = new Date()

		const booking = await Booking.findOne({
			_id: bookingId,
			bookingOwner: userId,
		})

		if (!booking) {
			return res.status(404).json({
				success: false,
				error: 'Бронирование не найдено',
			})
		}

		if (booking.departureDate <= now) {
			return res.status(400).json({
				success: false,
				error: 'Нельзя отменить завершенное бронирование',
			})
		}

		await Booking.findByIdAndDelete(bookingId)

		await Rooms.findByIdAndUpdate(booking.room, {
			$pull: { bookings: bookingId },
		})

		res.json({
			success: true,
			message: 'Бронирование успешно отменено',
		})
	} catch (error) {
		console.error('Cancel booking error:', error)
		res.status(500).json({
			success: false,
			error: 'Ошибка при отмене бронирования',
		})
	}
}

export const isRoomAvailable = async (roomId, arrivalDate, departureDate) => {
	try {
		const checkIn = new Date(arrivalDate)
		const checkOut = new Date(departureDate)
		const now = new Date()

		if (checkIn < now) return { available: false, reason: 'Cannot book in the past' }
		if (checkOut <= checkIn)
			return { available: false, reason: 'Departure must be after arrival' }

		const overlapping = await Booking.findOne({
			room: roomId,
			arrivalDate: { $lt: checkOut },
			departureDate: { $gt: checkIn },
		})

		return {
			available: !overlapping,
			reason: overlapping ? 'Room already booked' : null,
		}
	} catch (error) {
		return { available: false, reason: 'Server error' }
	}
}
