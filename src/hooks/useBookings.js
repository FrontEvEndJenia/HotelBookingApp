import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '../store/app.store'
import { useRoomStore } from '../store/room.store'
import { useAuth } from './useAuth'

export const useUserBookings = () => {
	const {
		bookings = { active: [], past: [] },
		loading: bookingsLoading,
		error: bookingsError,
		cancellingId,
		fetchUserBookings,
		cancelBooking,
		clearError,
	} = useAppStore()

	const { requireAuth } = useAuth()

	useEffect(() => {
		if (requireAuth()) {
			fetchUserBookings()
		}
	}, [fetchUserBookings, requireAuth])

	const handleCancelBooking = useCallback(
		async (bookingId) => {
			const result = await cancelBooking(bookingId)

			if (!result.success) {
				throw new Error(result.error || 'Не удалось отменить бронирование')
			}

			return result
		},
		[cancelBooking],
	)

	const getBookingStatus = useCallback((departureDate) => {
		const now = new Date()
		const departure = new Date(departureDate)

		if (departure < now) {
			return { text: 'Завершено', color: 'bg-gray-100 text-gray-800' }
		} else {
			return { text: 'Активно', color: 'bg-green-100 text-green-800' }
		}
	}, [])

	return {
		bookings,
		activeBookings: bookings.active || [],
		pastBookings: bookings.past || [],
		loading: bookingsLoading,
		error: bookingsError,
		cancellingId,
		handleCancelBooking,
		refreshBookings: fetchUserBookings,
		clearError,
		getBookingStatus,
		hasActiveBookings: (bookings.active || []).length > 0,
		totalBookings: (bookings.active || []).length + (bookings.past || []).length,
	}
}

export const useCreateBooking = (roomId) => {
	const { bookingData } = useRoomStore()
	const {
		createBooking: createBookingApi,
		loading: bookingLoading,
		error: bookingError,
		clearError,
	} = useAppStore()

	const { requireAuth } = useAuth()

	const [dateError, setDateError] = useState('')

	const handleCreateBooking = useCallback(async () => {
		if (!requireAuth()) {
			throw new Error('Требуется авторизация')
		}

		if (!roomId) {
			throw new Error('Не указан номер')
		}

		const result = await createBookingApi(roomId, {
			arrivalDate: bookingData.arrivalDate,
			departureDate: bookingData.departureDate,
			guestsCount: bookingData.guests,
		})

		if (!result.success) {
			throw new Error(result.error || 'Ошибка при создании бронирования')
		}

		return result
	}, [roomId, bookingData, createBookingApi, requireAuth])

	const validateDates = useCallback(
		(arrivalDate, departureDate, roomMaxGuests = 2) => {
			setDateError('')

			if (!arrivalDate || !departureDate) {
				setDateError('Выберите обе даты')
				return false
			}

			const start = new Date(arrivalDate)
			const end = new Date(departureDate)
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			if (start < today) {
				setDateError('Нельзя выбрать прошедшую дату')
				return false
			}

			if (end <= start) {
				setDateError('Дата выезда должна быть позже даты заезда')
				return false
			}

			if (bookingData.guests > roomMaxGuests) {
				setDateError(`Максимум ${roomMaxGuests} гостей`)
				return false
			}

			return true
		},
		[bookingData.guests],
	)

	return {
		createBooking: handleCreateBooking,
		loading: bookingLoading,
		error: bookingError || dateError,
		clearError,

		validateDates,
		setDateError,

		bookingData: {
			arrivalDate: bookingData.arrivalDate,
			departureDate: bookingData.departureDate,
			guests: bookingData.guests,
		},

		isFormValid:
			bookingData.arrivalDate &&
			bookingData.departureDate &&
			bookingData.guests > 0,
	}
}
