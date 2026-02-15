import { Calendar, User, Home, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice, formatDate, calculateNights } from '../../utils/formatters'

export const BookingCard = ({
	booking,
	isActive,
	cancellingId,
	onCancel,
	getBookingStatus,
}) => {
	const status = getBookingStatus(booking.departureDate)
	const nights = calculateNights(booking.arrivalDate, booking.departureDate)
	const totalPrice = nights * (booking.room?.price || 0)
	const isCancelling = cancellingId === booking._id

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between gap-6">
				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<Home size={20} className="text-gray-500" />
							<span className="font-semibold text-lg text-gray-900">
								{booking.room?.title || 'Номер'}
							</span>
						</div>
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
						>
							{status.text}
						</span>
					</div>

					<div className="grid gap-4">
						<div className="flex items-center gap-2">
							<Calendar size={18} className="text-gray-500" />
							<div>
								<p className="font-medium text-gray-900">
									{formatDate(booking.arrivalDate)} -{' '}
									{formatDate(booking.departureDate)}
								</p>
								<p className="text-sm text-gray-500">{nights} ночей</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<User size={18} className="text-gray-500" />
							<div>
								<p className="font-medium text-gray-900">
									{booking.guestsCount} гостей
								</p>
								<p className="text-sm text-gray-500">
									Максимум: {booking.room?.maxGuests || 2}
								</p>
							</div>
						</div>

						<div>
							<p className="font-bold text-lg text-gray-900">
								{formatPrice(totalPrice)} ₽
							</p>
							<p className="text-sm text-gray-500">
								{formatPrice(booking.room?.price || 0)} ₽ за ночь
							</p>
						</div>
					</div>
				</div>

				{isActive && (
					<div className="flex gap-3">
						<button
							onClick={() =>
								onCancel(booking._id, booking.room?.title || 'Номер')
							}
							disabled={isCancelling}
							className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
						>
							{isCancelling ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
									Отмена...
								</>
							) : (
								<>
									<X size={18} />
									Отменить
								</>
							)}
						</button>
						<Link
							to={`/rooms/${booking.room?._id}`}
							className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
						>
							<span>Подробнее</span>
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
