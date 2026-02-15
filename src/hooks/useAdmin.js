import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '../store/app.store'

export const useAdminUsers = () => {
	const {
		users,
		roles,
		loading: usersLoading,
		error: usersError,
		fetchAllUsers,
		updateUserRole,
		deleteUser,
		clearError,
	} = useAppStore()

	const [searchTerm, setSearchTerm] = useState('')
	const [editingUserId, setEditingUserId] = useState(null)
	const [selectedRole, setSelectedRole] = useState('')

	useEffect(() => {
		fetchAllUsers()
	}, [fetchAllUsers])

	const filteredUsers = users.filter((user) => {
		if (!searchTerm) return true
		const searchLower = searchTerm.toLowerCase()
		const userName = user.login?.toLowerCase() || ''
		return userName.includes(searchLower)
	})

	const handleDeleteUser = useCallback(
		async (userId) => {
			await deleteUser(userId)
		},
		[deleteUser],
	)

	const handleRoleChange = useCallback(
		async (userId) => {
			if (!selectedRole) return
			await updateUserRole(userId, parseInt(selectedRole))
			setEditingUserId(null)
			setSelectedRole('')
		},
		[selectedRole, updateUserRole],
	)

	const isUserAdmin = useCallback((user) => user.role === 0, [])

	return {
		users: filteredUsers,
		roles,
		loading: usersLoading,
		error: usersError,
		searchTerm,
		setSearchTerm,
		editingUserId,
		setEditingUserId,
		selectedRole,
		setSelectedRole,
		handleDeleteUser,
		handleRoleChange,
		isAdmin: isUserAdmin,
		clearError,
	}
}

export const useAdminBookings = () => {
	const {
		adminBookings,
		loading: bookingsLoading,
		error: bookingsError,
		fetchAllBookings,
		deleteAdminBooking,
		clearError,
	} = useAppStore()

	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		fetchAllBookings()
	}, [fetchAllBookings])

	const filteredBookings = adminBookings.filter((booking) => {
		if (!searchTerm) return true
		const searchLower = searchTerm.toLowerCase()
		const userName = booking.bookingOwner?.login?.toLowerCase() || ''
		const roomName = booking.room?.title?.toLowerCase() || ''
		return userName.includes(searchLower) || roomName.includes(searchLower)
	})

	const handleDeleteBooking = useCallback(
		async (bookingId) => {
			await deleteAdminBooking(bookingId)
		},
		[deleteAdminBooking],
	)

	const getBookingStatus = useCallback((departureDate) => {
		const now = new Date()
		const departure = new Date(departureDate)
		return departure > now
	}, [])

	return {
		bookings: filteredBookings,
		loading: bookingsLoading,
		error: bookingsError,
		searchTerm,
		setSearchTerm,
		handleDeleteBooking,
		getBookingStatus,
		clearError,
	}
}
