import { useRoomStore } from '../../../../store/room.store'

export const GuestsCounter = ({ maxGuests }) => {
	const { bookingData, updateBookingData } = useRoomStore()

	const handleGuestsChange = (change) => {
		const newGuests = Math.max(1, Math.min(maxGuests, bookingData.guests + change))
		updateBookingData({ guests: newGuests })
	}

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				Количество гостей
			</label>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => handleGuestsChange(-1)}
					className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={bookingData.guests <= 1}
				>
					-
				</button>
				<div className="flex-1 text-center font-medium">
					{bookingData.guests} {bookingData.guests === 1 ? 'гость' : 'гостей'}
				</div>
				<button
					type="button"
					onClick={() => handleGuestsChange(1)}
					className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={bookingData.guests >= maxGuests}
				>
					+
				</button>
			</div>
			<p className="text-sm text-gray-500 mt-1">Максимум: {maxGuests} гостей</p>
		</div>
	)
}
