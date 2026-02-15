import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useRoomStore } from '../../../../store/room.store'
import { ErrorMessage } from '../../../../components/common/error-message'
import { formatPrice, calculateNights } from '../../../../utils/formatters'
import { DatePicker } from './date-picker'
import { GuestsCounter } from './guests-counter'

export const BookingForm = ({
	room,
	bookingLoading,
	error,
	isAvailable,
	onBooking,
	user,
	onClearError,
}) => {
	const [localError, setLocalError] = useState('')
	const { bookingData, updateBookingData, resetBookingData } = useRoomStore()
	const nights = calculateNights(bookingData.arrivalDate, bookingData.departureDate)
	const totalPrice = nights * (room?.price || 0)

	const handleCheckInChange = (date) => {
		updateBookingData({
			arrivalDate: date,
			departureDate: '',
		})
		setLocalError('')
	}

	const handleCheckOutChange = (date) => {
		updateBookingData({ departureDate: date })
		setLocalError('')
	}

	const handleGuestsChange = (change) => {
		const newGuests = Math.max(
			1,
			Math.min(room.maxGuests || 2, bookingData.guests + change),
		)
		updateBookingData({ guests: newGuests })
	}

	const getButtonText = () => {
		if (bookingLoading) return 'Бронируем...'
		if (!user) return 'Войти для бронирования'
		if (!isAvailable) return 'Выберите свободные даты'
		return 'Забронировать номер'
	}

	const isBookingDisabled =
		bookingLoading ||
		!bookingData.arrivalDate ||
		!bookingData.departureDate ||
		!isAvailable ||
		nights === 0

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLocalError('')
		onClearError?.()

		if (!bookingData.arrivalDate || !bookingData.departureDate) {
			setLocalError('Выберите обе даты')
			return
		}

		if (nights === 0) {
			setLocalError('Дата выезда должна быть позже даты заезда')
			return
		}

		if (!isAvailable) {
			setLocalError('Выбранный период уже занят')
			return
		}

		await onBooking()
		resetBookingData()
	}

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
			<h2 className="text-xl font-bold text-gray-900 mb-6">Забронировать номер</h2>

			{(error || localError) && (
				<div className="mb-4">
					<ErrorMessage
						error={error || localError}
						onClose={() => {
							onClearError?.()
							setLocalError('')
						}}
					/>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<DatePicker
					label="Дата заезда"
					value={bookingData.arrivalDate}
					onChange={handleCheckInChange}
					minDate={new Date().toISOString().split('T')[0]}
					required
				/>

				<DatePicker
					label="Дата выезда"
					value={bookingData.departureDate}
					onChange={handleCheckOutChange}
					minDate={
						bookingData.arrivalDate || new Date().toISOString().split('T')[0]
					}
					required
					disabled={!bookingData.arrivalDate}
				/>

				<GuestsCounter
					guests={bookingData.guests}
					maxGuests={room.maxGuests}
					onChange={handleGuestsChange}
				/>

				{bookingData.arrivalDate && bookingData.departureDate && (
					<div
						className={`p-3 rounded-lg border ${
							isAvailable
								? 'bg-green-50 border-green-200'
								: 'bg-red-50 border-red-200'
						}`}
					>
						<div className="flex items-center gap-2">
							{isAvailable ? (
								<>
									<Check className="text-green-600" size={18} />
									<div>
										<p className="font-medium text-green-800">
											{nights > 0
												? `Выбранный период свободен (${nights} ночей)`
												: 'Выберите корректные даты'}
										</p>
										<p className="text-sm text-green-700">
											{nights > 0
												? `${formatPrice(totalPrice)} ₽`
												: 'Дата выезда должна быть позже заезда'}
										</p>
									</div>
								</>
							) : (
								<>
									<X className="text-red-600" size={18} />
									<div>
										<p className="font-medium text-red-800">
											Выбранный период занят
										</p>
										<p className="text-sm text-red-700">
											Пожалуйста, выберите другие даты
										</p>
									</div>
								</>
							)}
						</div>
					</div>
				)}

				{bookingData.arrivalDate &&
					bookingData.departureDate &&
					isAvailable &&
					nights > 0 && (
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="flex justify-between font-medium">
								<span>Итого:</span>
								<span>{formatPrice(totalPrice)} ₽</span>
							</div>
							<p className="text-sm text-gray-500 mt-1">
								{nights} ночей × {formatPrice(room.price)} ₽
							</p>
						</div>
					)}

				<button
					type="submit"
					disabled={isBookingDisabled}
					className={`w-full py-3 rounded-lg font-medium transition-colors ${
						isBookingDisabled
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-gradient-to-r from-[#6F7B55] to-[#93A06C] text-white hover:from-[#7F8B65] hover:to-[#A3B07C]'
					}`}
				>
					{getButtonText()}
				</button>

				{!user && (
					<p className="text-center text-sm text-gray-500">
						<Link to="/login" className="text-[#6F7B55] hover:underline">
							Войдите
						</Link>
						{' или '}
						<Link to="/register" className="text-[#6F7B55] hover:underline">
							зарегистрируйтесь
						</Link>
						{' для бронирования'}
					</p>
				)}
			</form>
		</div>
	)
}
