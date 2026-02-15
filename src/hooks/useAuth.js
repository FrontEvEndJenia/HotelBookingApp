import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/app.store'

export const useAuth = () => {
	const navigate = useNavigate()

	const user = useAppStore((state) => state.user)
	const isAuthenticated = useAppStore((state) => state.isAuthenticated)
	const loading = useAppStore((state) => state.loading)
	const error = useAppStore((state) => state.error)

	const loginMethod = useAppStore((state) => state.login)
	const registerMethod = useAppStore((state) => state.register)
	const logoutMethod = useAppStore((state) => state.logout)
	const checkAuth = useAppStore((state) => state.checkAuth)
	const clearError = useAppStore((state) => state.clearError)
	const isAdmin = useAppStore((state) => state.isAdmin)
	const isModerator = useAppStore((state) => state.isModerator)
	const canAccessAdmin = useAppStore((state) => state.canAccessAdmin)

	const loginWithRedirect = useCallback(
		async (login, password, redirectTo = '/') => {
			const result = await loginMethod(login, password)
			if (result.success) {
				navigate(redirectTo)
			}
			return result
		},
		[loginMethod, navigate],
	)

	const registerWithRedirect = useCallback(
		async (login, password, redirectTo = '/') => {
			const result = await registerMethod(login, password)
			if (result.success) {
				navigate(redirectTo)
			}
			return result
		},
		[registerMethod, navigate],
	)

	const logoutWithRedirect = useCallback(
		async (redirectTo = '/') => {
			await logoutMethod()
			navigate(redirectTo)
		},
		[logoutMethod, navigate],
	)

	const requireAuth = useCallback(
		(redirectTo = '/login') => {
			if (!isAuthenticated) {
				navigate(redirectTo)
				return false
			}
			return true
		},
		[isAuthenticated, navigate],
	)

	const requireAdmin = useCallback(
		(redirectTo = '/') => {
			if (!isAuthenticated || !canAccessAdmin()) {
				navigate(redirectTo)
				return false
			}
			return true
		},
		[isAuthenticated, canAccessAdmin, navigate],
	)

	return {
		user,
		isAuthenticated,
		loading,
		error,
		login: loginMethod,
		register: registerMethod,
		logout: logoutMethod,
		checkAuth,
		clearError,
		loginWithRedirect,
		registerWithRedirect,
		logoutWithRedirect,
		requireAuth,
		requireAdmin,
		isAdmin: isAdmin(),
		isModerator: isModerator(),
		canAccessAdmin: canAccessAdmin(),
		getRoleName: () => {
			if (!user) return ''
			switch (user.roleId) {
				case 0:
					return 'Администратор'
				case 1:
					return 'Модератор'
				case 2:
					return 'Пользователь'
				default:
					return 'Гость'
			}
		},
	}
}

export const useCurrentUser = () => {
	const user = useAppStore((state) => state.user)
	const isAuthenticated = useAppStore((state) => state.isAuthenticated)
	const isAdmin = useAppStore((state) => state.isAdmin)
	const isModerator = useAppStore((state) => state.isModerator)
	const canAccessAdmin = useAppStore((state) => state.canAccessAdmin)

	return {
		user,
		isAuthenticated,
		isAdmin: isAdmin(),
		isModerator: isModerator(),
		canAccessAdmin: canAccessAdmin(),
		login: user?.login || '',
	}
}
