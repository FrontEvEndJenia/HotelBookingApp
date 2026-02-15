import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useAdminBookings } from '../../hooks'
import {
	AdminPageHeader,
	ConfirmModal,
	ErrorMessage,
	LoadingSpinner,
} from '../../components'
import { useConfirmModal } from '../../hooks/useConfirmModal'
import { formatPrice, formatDate, calculateNights } from '../../utils/formatters'

export const AdminBookings = () => {
	const {
		bookings,
		loading,
		error,
		searchTerm,
		setSearchTerm,
		handleDeleteBooking,
		getBookingStatus,
		clearError,
	} = useAdminBookings()

	const { modalState, openDeleteConfirm, closeModal, handleConfirm } = useConfirmModal()

	const [localError, setLocalError] = useState('')

	if (loading) {
		return <LoadingSpinner fullScreen text="Загрузка бронирований..." />
	}

	return (
		<div className="max-w-7xl mx-auto">
			<AdminPageHeader
				title="Управление бронированиями"
				subtitle={`Всего бронирований: ${bookings.length}`}
			/>

			<div className="p-6">
				<div className="mb-6">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Поиск по пользователю или номеру..."
						className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
					/>
				</div>

				{(error || localError) && (
					<ErrorMessage
						error={error || localError}
						onClose={() => {
							clearError()
							setLocalError('')
						}}
					/>
				)}

				{bookings.length === 0 ? (
					<div className="p-8 text-center text-gray-500">
						Бронирований не найдено
					</div>
				) : (
					<div className="space-y-4">
						{bookings.map((booking) => {
							const nights = calculateNights(
								booking.arrivalDate,
								booking.departureDate,
							)
							const totalPrice = nights * (booking.room?.price || 0)
							const isActive = getBookingStatus(booking.departureDate)

							return (
								<div
									key={booking._id}
									className="bg-white border border-gray-200 rounded-lg p-4"
								>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<div className="w-8 h-8 bg-[#6F7B55]/20 rounded-full flex items-center justify-center">
													<span className="text-sm font-medium text-[#6F7B55]">
														{booking.bookingOwner?.login
															?.charAt(0)
															?.toUpperCase() || 'U'}
													</span>
												</div>
												<div>
													<h3 className="font-medium">
														{booking.room?.title || 'Номер'}
													</h3>
													<p className="text-sm text-gray-600">
														{booking.bookingOwner?.login ||
															'Неизвестно'}
													</p>
												</div>
											</div>

											<div className="grid grid-cols-3 gap-4 text-sm">
												<div>
													<p className="font-medium">Даты</p>
													<p>
														{formatDate(booking.arrivalDate)}{' '}
														-{' '}
														{formatDate(
															booking.departureDate,
														)}
													</p>
													<p className="text-gray-500">
														{nights} ночей
													</p>
												</div>
												<div>
													<p className="font-medium">Гости</p>
													<p>{booking.guestsCount} человек</p>
												</div>
												<div>
													<p className="font-medium">
														Стоимость
													</p>
													<p>{formatPrice(totalPrice)} ₽</p>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2 ml-4">
											<span
												className={`px-2 py-1 rounded text-xs ${
													isActive
														? 'bg-green-100 text-green-800'
														: 'bg-gray-100 text-gray-800'
												}`}
											>
												{isActive ? 'Активно' : 'Завершено'}
											</span>
											<button
												onClick={() =>
													openDeleteConfirm(
														booking._id,
														booking.room?.title ||
															'Бронирование',
														async (data) => {
															try {
																await handleDeleteBooking(
																	data.id,
																)
															} catch (err) {
																setLocalError(
																	err.message ||
																		'Ошибка при удалении',
																)
																throw err
															}
														},
													)
												}
												className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
												title="Удалить"
											>
												<Trash2 size={18} />
											</button>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}

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
	)
}
