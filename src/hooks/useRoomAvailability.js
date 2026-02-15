import { useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '../store/app.store'
import { calculateNights } from '../utils/formatters'

export const useRoomAvailability = (roomId, roomPrice) => {
	const { bookedDates, fetchBookedDates, loading: datesLoading } = useAppStore()

	const loadedRoomIdRef = useRef(null)

	const calculateTotalPrice = useCallback(
		(arrivalDate, departureDate) => {
			if (!arrivalDate || !departureDate) return 0
			const nights = calculateNights(arrivalDate, departureDate)
			return nights * (roomPrice || 0)
		},
		[roomPrice],
	)

	const isPeriodAvailable = useCallback(
		(arrivalDate, departureDate) => {
			if (!arrivalDate || !departureDate) return true

			const startMs = new Date(arrivalDate).setHours(0, 0, 0, 0)
			const endMs = new Date(departureDate).setHours(0, 0, 0, 0)

			if (endMs <= startMs) return false

			if (!bookedDates[roomId] || bookedDates[roomId].length === 0) {
				return true
			}

			for (const booked of bookedDates[roomId]) {
				const bookedStartMs = new Date(booked.start).setHours(0, 0, 0, 0)
				const bookedEndMs = new Date(booked.end).setHours(0, 0, 0, 0)
				const hasOverlap = startMs < bookedEndMs && endMs > bookedStartMs

				if (hasOverlap) {
					return false
				}
			}

			return true
		},
		[roomId, bookedDates],
	)

	const loadBookedDates = useCallback(async () => {
		if (!roomId) return

		if (roomId !== loadedRoomIdRef.current || !bookedDates[roomId]) {
			loadedRoomIdRef.current = roomId
			return fetchBookedDates(roomId)
		}

		return Promise.resolve()
	}, [roomId, fetchBookedDates, bookedDates])

	useEffect(() => {
		if (roomId) {
			loadBookedDates()
		}
	}, [roomId, loadBookedDates])

	return {
		bookedDates: bookedDates[roomId] || [],
		loading: datesLoading,
		isPeriodAvailable,
		calculateNights,
		calculateTotalPrice,
		loadBookedDates,
	}
}
