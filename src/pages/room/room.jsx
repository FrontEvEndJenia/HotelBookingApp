import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Edit, AlertCircle } from 'lucide-react'
import {
	useRoom,
	useRoomAvailability,
	useCreateBooking,
	useAuth,
	useCurrentUser,
} from '../../hooks'
import { PageHeader } from '../../components/common/page-header'
import { LoadingSpinner } from '../../components/common/loading-spinner'
import { ErrorMessage } from '../../components/common/error-message'
import { RoomGallery } from './components/room-gallery'
import { RoomInfo } from './components/room-info'
import { BookedDates } from './components/booked-dates'
import { BookingForm } from './components/booking-form'
import { useRoomStore } from '../../store/room.store'

export default function RoomDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { resetBookingData } = useRoomStore()

	const {
		room,
		loading: roomLoading,
		error: roomError,
		loadRoom,
		clearError: clearRoomError,
	} = useRoom(id)

	const {
		bookedDates,
		loadBookedDates,
		isPeriodAvailable,
		loading: datesLoading,
	} = useRoomAvailability(id, room?.price)

	const {
		createBooking,
		loading: bookingLoading,
		error: bookingError,
		clearError: clearBookingError,
	} = useCreateBooking(id)

	const { requireAuth } = useAuth()
	const { user, canAccessAdmin } = useCurrentUser()
	const canEdit = canAccessAdmin
	const [isAvailable, setIsAvailable] = useState(true)
	const { bookingData } = useRoomStore()

	useEffect(() => {
		if (bookingData.arrivalDate && bookingData.departureDate) {
			const available = isPeriodAvailable(
				bookingData.arrivalDate,
				bookingData.departureDate,
			)
			setIsAvailable(available)
		}
	}, [bookingData.arrivalDate, bookingData.departureDate, isPeriodAvailable])

	useEffect(() => {
		if (room && room._id === id) {
			loadBookedDates()
		}
	}, [room, id, loadBookedDates])

	useEffect(() => {
		if (id) {
			loadRoom()
			loadBookedDates()
		}
	}, [id, loadRoom, loadBookedDates])

	useEffect(() => {
		return () => {
			resetBookingData()
		}
	}, [resetBookingData])

	const handleBooking = async () => {
		if (!requireAuth()) {
			navigate('/login', { state: { from: `/rooms/${id}` } })
			return
		}

		if (!isAvailable) {
			throw new Error('Выбранный период уже занят')
		}

		try {
			await createBooking()
			navigate('/my-bookings')
		} catch (error) {
			console.error('Ошибка при бронировании:', error)
			throw error
		}
	}

	if (roomLoading) {
		return <LoadingSpinner fullScreen text="Загрузка номера..." />
	}

	if (roomError || !room) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<div className="text-center max-w-md p-6">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-gray-900 mb-3">
						{roomError || 'Номер не найден'}
					</h1>
					<p className="text-gray-600 mb-6">
						Запрашиваемый номер не существует или произошла ошибка загрузки
					</p>
					<div className="flex flex-col gap-3 justify-center">
						<button
							onClick={() => loadRoom()}
							className="px-6 py-3 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45] transition-colors"
						>
							Попробовать снова
						</button>
						<Link
							to="/"
							className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
						>
							Вернуться на главную
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<PageHeader
					title={room.title}
					subtitle="Детальная информация о номере"
					actions={
						canEdit ? (
							<Link
								to={`/rooms/${id}/edit`}
								className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45]"
							>
								<Edit size={18} />
								Редактировать
							</Link>
						) : null
					}
					showBackButton={true}
				/>

				{roomError && (
					<div className="mb-6">
						<ErrorMessage error={roomError} onClose={clearRoomError} />
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div>
						<RoomGallery images={room.images} />

						<RoomInfo room={room}>
							<div className="mb-6">
								<BookedDates dates={bookedDates} loading={datesLoading} />
							</div>
						</RoomInfo>
					</div>

					<div>
						<BookingForm
							room={room}
							bookingLoading={bookingLoading}
							error={bookingError}
							isAvailable={isAvailable}
							onBooking={handleBooking}
							user={user}
							onClearError={clearBookingError}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
