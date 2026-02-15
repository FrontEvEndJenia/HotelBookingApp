import { User as UserIcon } from 'lucide-react'
import { formatPrice } from '../../../utils/formatters'

export const RoomInfo = ({ room, children }) => {
	return (
		<div>
			<div className="flex items-center gap-4 text-gray-600 mb-4">
				<div className="flex items-center gap-1">
					<UserIcon size={18} />
					<span>До {room.maxGuests || 2} гостей</span>
				</div>
				<div>
					<span className="capitalize">{room.roomType || 'стандарт'}</span>
				</div>
			</div>

			<p className="text-gray-700 text-lg mb-6">
				{room.description || 'Описание отсутствует'}
			</p>

			<div className="bg-gray-50 rounded-lg p-4 mb-6">
				<div className="text-2xl font-bold text-gray-900">
					{formatPrice(room.price || 0)} ₽
				</div>
				<div className="text-gray-600">за ночь</div>
			</div>
			{children}
		</div>
	)
}
