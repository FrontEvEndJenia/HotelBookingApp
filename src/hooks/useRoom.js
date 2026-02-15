import { useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '../store/app.store'

export const useRoom = (roomId) => {
	const {
		currentRoom,
		loading: roomLoading,
		error: roomError,
		fetchRoom,
		updateRoom,
		clearError,
	} = useAppStore()

	const prevRoomIdRef = useRef(null)
	const isInitialMount = useRef(true)

	const loadRoom = useCallback(async () => {
		if (!roomId) return

		try {
			await fetchRoom(roomId)
		} catch (error) {
			console.error('Ошибка при загрузке номера:', error)
		}
	}, [roomId, fetchRoom])

	useEffect(() => {
		if (
			roomId &&
			(isInitialMount.current || roomId !== prevRoomIdRef.current || !currentRoom)
		) {
			isInitialMount.current = false
			prevRoomIdRef.current = roomId
			loadRoom()
		}
	}, [roomId, currentRoom, loadRoom])

	const updateRoomData = useCallback(
		async (roomData) => {
			if (!roomId) {
				throw new Error('ID номера не указан')
			}

			try {
				const result = await updateRoom(roomId, roomData)
				if (!result.success) {
					throw new Error(result.error || 'Ошибка при обновлении номера')
				}
				return result
			} catch (error) {
				throw error
			}
		},
		[roomId, updateRoom],
	)

	return {
		room: currentRoom,
		loading: roomLoading,
		error: roomError,
		loadRoom,
		updateRoom: updateRoomData,
		clearError,
		isRoomDataComplete:
			currentRoom?.title && currentRoom?.description && currentRoom?.price,
	}
}
