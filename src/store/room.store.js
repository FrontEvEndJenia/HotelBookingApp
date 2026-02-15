import { create } from 'zustand'

export const useRoomStore = create((set, get) => ({
	currentImageIndex: 0,
	bookingData: {
		arrivalDate: '',
		departureDate: '',
		guests: 1,
	},

	setCurrentImageIndex: (index) => set({ currentImageIndex: index }),
	nextImage: () => {
		const { currentImageIndex } = get()
		set((state) => ({
			currentImageIndex:
				(currentImageIndex + 1) % (state.room?.images?.length || 1),
		}))
	},
	prevImage: () => {
		const { currentImageIndex } = get()
		set((state) => ({
			currentImageIndex:
				currentImageIndex === 0
					? (state.room?.images?.length || 1) - 1
					: currentImageIndex - 1,
		}))
	},

	setBookingData: (data) => set({ bookingData: data }),
	updateBookingData: (updates) =>
		set((state) => ({
			bookingData: { ...state.bookingData, ...updates },
		})),
	resetBookingData: () =>
		set({
			bookingData: { arrivalDate: '', departureDate: '', guests: 1 },
			currentImageIndex: 0,
		}),
}))
