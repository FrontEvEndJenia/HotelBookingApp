import { Link } from 'react-router-dom'
import { ConfirmModal } from '../../components/common/confirm-modal'
import { ErrorMessage } from '../../components/common/error-message'
import { LoadingSpinner } from '../../components/common/loading-spinner'
import { PageHeader, SectionHeader } from '../../components/common/page-header'
import { BookingCard } from './booking-card'
import { Calendar } from 'lucide-react'
import { useUserBookings } from '../../hooks'
import { useConfirmModal } from '../../hooks/useConfirmModal'

export default function MyBookingsPage() {
	const {
		activeBookings,
		pastBookings,
		loading,
		error,
		handleCancelBooking,
		clearError,
		getBookingStatus,
		hasActiveBookings,
		totalBookings,
		cancellingId,
	} = useUserBookings()

	const { modalState, openCancelConfirm, closeModal, handleConfirm } = useConfirmModal()

	if (loading && !activeBookings?.length && !pastBookings?.length) {
		return <LoadingSpinner fullScreen text="Загрузка бронирований..." />
	}

	const headerActions = (
		<Link
			to="/"
			className="px-4 py-2 bg-gradient-to-r from-[#6F7B55] to-[#93A06C] text-white rounded-lg hover:from-[#7F8B65] hover:to-[#A3B07C] transition-colors font-medium"
		>
			Забронировать еще
		</Link>
	)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-4">
				<div className="bg-white rounded-xl shadow-sm">
					<PageHeader
						title="Мои бронирования"
						subtitle={`Всего бронирований: ${totalBookings || 0}`}
						actions={headerActions}
						className="px-6 pt-6"
					/>

					<div className="px-6 pb-8">
						{error && <ErrorMessage error={error} onClose={clearError} />}

						<ActiveBookingsSection
							bookings={activeBookings}
							loading={loading}
							cancellingId={cancellingId}
							onCancel={(id, name) =>
								openCancelConfirm(id, name, () => handleCancelBooking(id))
							}
							getBookingStatus={getBookingStatus}
							hasBookings={hasActiveBookings}
						/>

						<PastBookingsSection
							bookings={pastBookings}
							getBookingStatus={getBookingStatus}
						/>

						<div className="mt-8 text-center">
							<Link
								to="/"
								className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
							>
								<span>← Вернуться на главную</span>
							</Link>
						</div>
					</div>

					<ConfirmModal
						isOpen={modalState.isOpen}
						title={modalState.title}
						message={modalState.message}
						confirmText={modalState.confirmText}
						cancelText={modalState.cancelText}
						type={modalState.type}
						variant={modalState.variant}
						loading={modalState.loading}
						onConfirm={handleConfirm}
						onCancel={closeModal}
					/>
				</div>
			</div>
		</div>
	)
}

const ActiveBookingsSection = ({
	bookings,
	loading,
	cancellingId,
	onCancel,
	getBookingStatus,
	hasBookings,
}) => {
	if (loading && (!bookings || bookings.length === 0)) {
		return (
			<div className="mb-12">
				<SectionHeader
					title="Активные бронирования"
					subtitle={`${bookings?.length || 0} бронирований`}
				/>
				<LoadingSpinner text="Загрузка активных бронирований..." />
			</div>
		)
	}

	return (
		<div className="mb-12">
			<SectionHeader
				title="Активные бронирования"
				subtitle={`${bookings?.length || 0} бронирований`}
			/>

			{!bookings || bookings.length === 0 ? (
				<div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
					<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Нет активных бронирований
					</h3>
					<p className="text-gray-600 mb-4">У вас нет текущих бронирований</p>
					<Link
						to="/"
						className="inline-block bg-gradient-to-r from-[#6F7B55] to-[#93A06C] text-white px-6 py-2 rounded-lg hover:from-[#7F8B65] hover:to-[#A3B07C] transition-colors"
					>
						Посмотреть номера
					</Link>
				</div>
			) : (
				<div className="space-y-4">
					{bookings.map((booking) => (
						<BookingCard
							key={booking._id}
							booking={booking}
							isActive={true}
							cancellingId={cancellingId}
							onCancel={onCancel}
							getBookingStatus={getBookingStatus}
						/>
					))}
				</div>
			)}
		</div>
	)
}

const PastBookingsSection = ({ bookings, getBookingStatus }) => {
	if (!bookings) {
		return (
			<div>
				<SectionHeader
					title="История бронирований"
					subtitle="Завершенные бронирования"
				/>
				<LoadingSpinner text="Загрузка истории бронирований..." />
			</div>
		)
	}

	return (
		<div>
			<SectionHeader
				title="История бронирований"
				subtitle={`${bookings?.length || 0} бронирований`}
			/>

			{!bookings || bookings.length === 0 ? (
				<div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
					<p className="text-gray-600">Нет истории бронирований</p>
				</div>
			) : (
				<div className="space-y-4">
					{bookings.map((booking) => (
						<BookingCard
							key={booking._id}
							booking={booking}
							isActive={false}
							getBookingStatus={getBookingStatus}
						/>
					))}
				</div>
			)}
		</div>
	)
}
