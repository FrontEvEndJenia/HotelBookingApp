import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '../store/app.store'
import { useDebounce } from './useDebounce'

export const useRooms = (initialPage = 1, limit = 12) => {
	const rooms = useAppStore((state) => state.rooms)
	const pagination = useAppStore((state) => state.pagination)
	const loading = useAppStore((state) => state.loading)
	const error = useAppStore((state) => state.error)
	const fetchRooms = useAppStore((state) => state.fetchRooms)
	const clearError = useAppStore((state) => state.clearError)

	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(initialPage)
	const debouncedSearch = useDebounce(searchTerm, 500)

	useEffect(() => {
		fetchRooms(currentPage, limit, debouncedSearch)
	}, [currentPage, debouncedSearch, limit, fetchRooms])

	const handleSearch = useCallback((value) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}, [])

	const handlePageChange = useCallback((newPage) => {
		setCurrentPage(newPage)

		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [])

	return {
		rooms,
		loading,
		error,
		currentPage: pagination?.currentPage || currentPage,
		lastPage: pagination?.lastPage || 1,
		total: pagination?.total || 0,
		setCurrentPage,
		handlePageChange,
		searchTerm,
		setSearchTerm: handleSearch,
		debouncedSearch,
		refreshRooms: () => fetchRooms(currentPage, limit, debouncedSearch),
		clearError,
	}
}
