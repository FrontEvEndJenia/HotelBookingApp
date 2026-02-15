import { useEffect } from 'react'
import { useAuth } from '../hooks'

export const StoreProvider = ({ children }) => {
	const { checkAuth } = useAuth()

	useEffect(() => {
		checkAuth()
	}, [])

	return children
}
