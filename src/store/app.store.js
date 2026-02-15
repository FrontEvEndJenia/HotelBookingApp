import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const apiRequest = async (url, method = 'GET', data = null) => {
	const options = {
		method,
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
	}

	if (data) {
		options.body = JSON.stringify(data)
	}

	try {
		const response = await fetch(`http://localhost:3001${url}`, options)
		const result = await response.json()

		if (!response.ok) {
			throw new Error(result.error || `Ошибка ${method} запроса`)
		}

		return result
	} catch (error) {
		console.error(`API Error (${url}):`, error)
		throw error
	}
}

export const useAppStore = create(
	persist(
		(set, get) => ({
			loading: false,
			error: null,
			cancellingId: null,

			user: null,
			isAuthenticated: false,

			rooms: [],
			currentRoom: null,

			bookings: {
				active: [],
				past: [],
			},

			adminBookings: [],
			users: [],
			roles: [],

			bookedDates: {},

			login: async (login, password) => {
				set({ loading: true, error: null })

				try {
					const result = await apiRequest('/login', 'POST', {
						login,
						password,
					})

					set({
						user: result.user,
						isAuthenticated: true,
						loading: false,
						error: null,
					})

					return { success: true, user: result.user }
				} catch (error) {
					set({ error: error.message, loading: false })
					return { success: false, error: error.message }
				}
			},

			register: async (login, password) => {
				set({ loading: true, error: null })

				try {
					const result = await apiRequest('/register', 'POST', {
						login,
						password,
					})

					set({
						user: result.user,
						isAuthenticated: true,
						loading: false,
						error: null,
					})

					return { success: true, user: result.user }
				} catch (error) {
					set({ error: error.message, loading: false })
					return { success: false, error: error.message }
				}
			},

			logout: async () => {
				set({ loading: true })

				try {
					await apiRequest('/logout', 'POST')
				} catch (error) {
					console.error('Ошибка при выходе:', error)
				} finally {
					set({
						user: null,
						isAuthenticated: false,
						loading: false,
						error: null,
						bookings: { active: [], past: [] },
						adminBookings: [],
						currentRoom: null,
						rooms: [],
					})
				}
			},

			checkAuth: async () => {
				const { user } = get()
				if (user && !get().isAuthenticated) {
					set({ isAuthenticated: true })
				}
			},

			isAdmin: () => {
				const { user } = get()
				return user && user.roleId === 0
			},

			isModerator: () => {
				const { user } = get()
				return user && user.roleId === 1
			},

			canAccessAdmin: () => {
				const { user } = get()
				return user && (user.roleId === 0 || user.roleId === 1)
			},

			fetchUserBookings: async () => {
				set({ loading: true, error: null })

				try {
					const result = await apiRequest('/my-bookings')

					if (result.data) {
						const bookingsData = {
							active: result.data.active || [],
							past: result.data.past || [],
						}

						set({
							bookings: bookingsData,
							loading: false,
						})

						return { success: true, bookings: bookingsData }
					}

					throw new Error(result.error || 'Не удалось загрузить бронирования')
				} catch (error) {
					set({ error: error.message, loading: false })
					return { success: false, error: error.message }
				}
			},

			cancelBooking: async (bookingId) => {
				set({ loading: true, error: null, cancellingId: bookingId })

				try {
					const result = await apiRequest(`/my-bookings/${bookingId}`, 'DELETE')

					if (result.success) {
						await get().fetchUserBookings()

						set({ loading: false, cancellingId: null })
						return {
							success: true,
							message: result.message || 'Бронирование отменено',
						}
					}

					throw new Error(result.error || 'Ошибка при отмене бронирования')
				} catch (error) {
					set({ error: error.message, loading: false, cancellingId: null })
					return { success: false, error: error.message }
				}
			},

			createBooking: async (roomId, bookingData) => {
				set({ loading: true, error: null })

				try {
					const result = await apiRequest(
						`/rooms/${roomId}/bookings`,
						'POST',
						bookingData,
					)

					if (result.data) {
						await get().fetchUserBookings()
						const bookedDates = { ...get().bookedDates }
						delete bookedDates[roomId]

						set({
							bookedDates,
							loading: false,
						})

						return { success: true, booking: result.data }
					}

					throw new Error(result.error || 'Ошибка при создании бронирования')
				} catch (error) {
					set({ error: error.message, loading: false })
					return { success: false, error: error.message }
				}
			},

			fetchBookedDates: async (roomId) => {
				const cachedDates = get().bookedDates[roomId]
				if (cachedDates) {
					return cachedDates
				}

				set({ loading: true, error: null })

				try {
					const result = await apiRequest(`/rooms/${roomId}/booked-dates`)
					const dates = result.data || []

					set((state) => ({
						bookedDates: {
							...state.bookedDates,
							[roomId]: dates,
						},
						loading: false,
					}))

					return dates
				} catch (error) {
					set({ error: error.message, loading: false })
					return []
				}
			},

			clearError: () => set({ error: null }),

			fetchAllBookings: async () => {
				set({ loading: true, error: null })
				try {
					const response = await fetch('http://localhost:3001/admin/bookings', {
						credentials: 'include',
					})
					const result = await response.json()

					if (result.error) {
						throw new Error(result.error)
					}

					set({
						adminBookings: result.data || [],
						loading: false,
					})

					return { success: true, bookings: result.data }
				} catch (error) {
					set({
						error: error.message,
						loading: false,
					})
					return {
						success: false,
						error: error.message,
					}
				}
			},

			fetchAllUsers: async () => {
				set({ loading: true, error: null })
				try {
					const response = await fetch('http://localhost:3001/users', {
						credentials: 'include',
					})
					const result = await response.json()

					if (result.error) {
						throw new Error(result.error)
					}

					const rolesResponse = await fetch(
						'http://localhost:3001/users/roles',
						{
							credentials: 'include',
						},
					)
					const rolesResult = await rolesResponse.json()

					set({
						users: result.data || [],
						roles: rolesResult.data || [],
						loading: false,
					})

					return {
						success: true,
						users: result.data,
						roles: rolesResult.data,
					}
				} catch (error) {
					set({
						error: error.message,
						loading: false,
					})
					return {
						success: false,
						error: error.message,
					}
				}
			},

			updateUserRole: async (userId, roleId) => {
				set({ loading: true, error: null })
				try {
					const response = await fetch(
						`http://localhost:3001/users/${userId}`,
						{
							method: 'PATCH',
							headers: { 'Content-Type': 'application/json' },
							credentials: 'include',
							body: JSON.stringify({ roleId }),
						},
					)
					const result = await response.json()

					if (result.error) {
						throw new Error(result.error)
					}

					const updatedUsers = get().users.map((user) =>
						user._id === userId ? { ...user, role: roleId } : user,
					)

					set({
						users: updatedUsers,
						loading: false,
					})

					return {
						success: true,
						user: result.data,
					}
				} catch (error) {
					set({
						error: error.message,
						loading: false,
					})
					return {
						success: false,
						error: error.message,
					}
				}
			},

			deleteUser: async (userId) => {
				set({ loading: true, error: null })
				try {
					const response = await fetch(
						`http://localhost:3001/users/${userId}`,
						{
							method: 'DELETE',
							credentials: 'include',
						},
					)
					const result = await response.json()

					if (result.error) {
						throw new Error(result.error)
					}

					const filteredUsers = get().users.filter(
						(user) => user._id !== userId,
					)

					set({
						users: filteredUsers,
						loading: false,
					})

					return { success: true }
				} catch (error) {
					set({
						error: error.message,
						loading: false,
					})
					return {
						success: false,
						error: error.message,
					}
				}
			},

			deleteAdminBooking: async (bookingId) => {
				set({ loading: true, error: null })
				try {
					const response = await fetch(
						`http://localhost:3001/admin/bookings/${bookingId}`,
						{
							method: 'DELETE',
							credentials: 'include',
						},
					)
					const result = await response.json()

					if (result.error) {
						throw new Error(result.error)
					}

					const filteredBookings = get().adminBookings.filter(
						(booking) => booking._id !== bookingId,
					)

					set({
						adminBookings: filteredBookings,
						loading: false,
					})

					return {
						success: true,
						message: result.message,
					}
				} catch (error) {
					set({
						error: error.message,
						loading: false,
					})
					return {
						success: false,
						error: error.message,
					}
				}
			},

			fetchRooms: async (page = 1, limit = 12, search = '') => {
				set({ loading: true, error: null })

				try {
					const params = new URLSearchParams({
						page: page.toString(),
						limit: limit.toString(),
					})

					if (search) {
						params.append('search', search)
					}

					const response = await fetch(
						`http://localhost:3001/rooms?${params.toString()}`,
					)
					const result = await response.json()

					if (response.ok && !result.error) {
						set({
							rooms: result.data?.rooms || [],
							pagination: {
								currentPage: result.data?.page || page,
								lastPage: result.data?.lastPage || 1,
								total: result.data?.total || 0,
								limit: result.data?.limit || limit,
							},
							loading: false,
							error: null,
						})

						return {
							success: true,
							rooms: result.data?.rooms || [],
							pagination: {
								currentPage: result.data?.page || page,
								lastPage: result.data?.lastPage || 1,
								total: result.data?.total || 0,
								limit: result.data?.limit || limit,
							},
						}
					} else {
						throw new Error(result.error || 'Не удалось загрузить номера')
					}
				} catch (error) {
					set({
						error: error.message,
						loading: false,
						rooms: [],
						pagination: {
							currentPage: 1,
							lastPage: 1,
							total: 0,
							limit: 12,
						},
					})
					return {
						success: false,
						error: error.message,
						rooms: [],
						pagination: null,
					}
				}
			},

			pagination: {
				currentPage: 1,
				lastPage: 1,
				total: 0,
				limit: 12,
			},

			fetchRoom: async (roomId) => {
				set({ loading: true, error: null })

				try {
					const result = await apiRequest(`/rooms/${roomId}`)

					if (result.data) {
						const roomData = result.data
						const normalizedRoom = {
							...roomData,
							price: Number(roomData.price) || 0,
							maxGuests: Number(roomData.maxGuests) || 2,
						}

						set({
							currentRoom: normalizedRoom,
							loading: false,
						})

						return { success: true, room: normalizedRoom }
					}

					throw new Error(result.error || 'Не удалось загрузить номер')
				} catch (error) {
					set({ error: error.message, loading: false })
					return { success: false, error: error.message }
				}
			},

			updateRoom: async (roomId, roomData) => {
				set({ loading: true, error: null })

				try {
					const result = await apiRequest(
						`/rooms/${roomId}/edit`,
						'PATCH',
						roomData,
					)

					if (result.data) {
						const updatedRoom = {
							...result.data,
							price: Number(result.data.price) || 0,
							maxGuests: Number(result.data.maxGuests) || 2,
						}

						const updatedRooms = get().rooms.map((room) =>
							room.id === roomId ? updatedRoom : room,
						)

						set({
							currentRoom: updatedRoom,
							rooms: updatedRooms,
							loading: false,
							error: null,
						})

						return { success: true, room: updatedRoom }
					}

					throw new Error(result.error || 'Ошибка при обновлении номера')
				} catch (error) {
					set({ error: error.message, loading: false })
					return { success: false, error: error.message }
				}
			},
		}),
		{
			name: 'app-storage',
			getStorage: () => localStorage,
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
)
