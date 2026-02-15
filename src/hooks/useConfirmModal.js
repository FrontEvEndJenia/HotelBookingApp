import { useState, useCallback } from 'react'

export const useConfirmModal = (initialState = {}) => {
	const [modalState, setModalState] = useState({
		isOpen: false,
		title: '',
		message: '',
		confirmText: 'Подтвердить',
		cancelText: 'Отмена',
		type: 'warning',
		variant: 'default',
		data: null,
		onConfirm: null,
		loading: false,
		...initialState,
	})

	const openModal = useCallback((options) => {
		setModalState((prev) => ({
			...prev,
			isOpen: true,
			loading: false,
			...options,
		}))
	}, [])

	const closeModal = useCallback(() => {
		setModalState((prev) => ({
			...prev,
			isOpen: false,
			loading: false,
			data: null,
			onConfirm: null,
		}))
	}, [])

	const setLoading = useCallback((loading) => {
		setModalState((prev) => ({
			...prev,
			loading,
		}))
	}, [])

	const openDeleteConfirm = useCallback(
		(id, name, onConfirm, options = {}) => {
			openModal({
				title: options.title || 'Удаление',
				message: options.message || `Вы уверены, что хотите удалить "${name}"?`,
				confirmText: options.confirmText || 'Удалить',
				type: 'danger',
				variant: 'danger',
				data: { id, name },
				onConfirm,
				...options,
			})
		},
		[openModal],
	)

	const openCancelConfirm = useCallback(
		(id, name, onConfirm, options = {}) => {
			openModal({
				title: options.title || 'Отмена бронирования',
				message:
					options.message ||
					`Вы уверены, что хотите отменить бронирование "${name}"?`,
				confirmText: options.confirmText || 'Отменить',
				type: 'danger',
				variant: 'danger',
				data: { id, name },
				onConfirm,
				...options,
			})
		},
		[openModal],
	)

	const handleConfirm = useCallback(async () => {
		if (modalState.onConfirm) {
			try {
				setLoading(true)
				await modalState.onConfirm(modalState.data)
				closeModal()
			} catch (error) {
				console.error('Ошибка при подтверждении:', error)
				setLoading(false)
			}
		} else {
			closeModal()
		}
	}, [modalState, closeModal, setLoading])

	return {
		modalState,
		openModal,
		closeModal,
		openDeleteConfirm,
		openCancelConfirm,
		setLoading,
		handleConfirm,
	}
}
