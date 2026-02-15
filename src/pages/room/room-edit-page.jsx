import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAppStore } from '../../store/app.store'
import RoomEditForm from '../../pages/room/room-edit-form'
import { PageHeader } from '../../components/common/page-header'
import { LoadingSpinner } from '../../components/common/loading-spinner'

export default function RoomEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()

	const { isAdmin, isModerator } = useAppStore()
	const { currentRoom, loading, error, fetchRoom } = useAppStore()

	const canEdit = isAdmin() || isModerator()

	useEffect(() => {
		if (!canEdit) {
			navigate('/login')
			return
		}

		if (id) {
			fetchRoom(id)
		}
	}, [id, canEdit])

	const handleSuccess = () => {
		navigate(`/rooms/${id}`)
	}

	const handleCancel = () => {
		navigate(`/rooms/${id}`)
	}

	if (!canEdit) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md p-6">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h1 className="text-xl font-bold text-gray-900 mb-2">
						Доступ запрещен
					</h1>
					<p className="text-gray-600 mb-6">
						У вас нет прав для редактирования номеров
					</p>
					<a
						href={`/rooms/${id}`}
						className="inline-block bg-gradient-to-r from-[#6F7B55] to-[#93A06C] text-white px-6 py-3 rounded-lg hover:from-[#7F8B65] hover:to-[#A3B07C] transition-colors"
					>
						Вернуться к номеру
					</a>
				</div>
			</div>
		)
	}

	if (loading) {
		return <LoadingSpinner fullScreen text="Загрузка номера..." />
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md p-6">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h1 className="text-xl font-bold text-gray-900 mb-2">
						Ошибка загрузки
					</h1>
					<p className="text-gray-600 mb-6">{error}</p>
					<div className="flex gap-3">
						<button
							onClick={() => fetchRoom(id)}
							className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
						>
							Попробовать снова
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				<PageHeader
					title="Редактирование номера"
					subtitle="Внесите изменения в информацию о номере"
					showBackButton={true}
					backButtonLabel="Вернуться к номеру"
				/>

				{currentRoom && (
					<RoomEditForm
						room={currentRoom}
						onCancel={handleCancel}
						onSuccess={handleSuccess}
					/>
				)}
			</div>
		</div>
	)
}
