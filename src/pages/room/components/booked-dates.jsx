import { Clock, Check } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'

export const BookedDates = ({ dates, loading, onRefresh }) => {
	if (loading) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="flex items-center gap-2">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
					<span className="text-yellow-700">
						Загрузка забронированных дат...
					</span>
				</div>
			</div>
		)
	}

	const hasBookings = dates.length > 0

	return (
		<div
			className={`${
				hasBookings
					? 'bg-yellow-50 border-yellow-200'
					: 'bg-green-50 border-green-200'
			} border rounded-lg p-4`}
		>
			{hasBookings ? (
				<>
					<div className="flex items-center gap-2 mb-3">
						<Clock className="text-yellow-600" size={18} />
						<h3 className="font-medium text-yellow-800">
							Забронированные даты
						</h3>
					</div>
					<div className="space-y-2 max-h-60 overflow-y-auto">
						{dates.map((booked, index) => (
							<div
								key={index}
								className="text-sm text-yellow-700 flex items-center gap-2 p-2 bg-yellow-100/50 rounded"
							>
								<div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
								<div className="flex-1">
									<span className="font-medium">
										{formatDate(booked.start)}
									</span>
									<span className="mx-2">—</span>
									<span className="font-medium">
										{formatDate(booked.end)}
									</span>
								</div>
							</div>
						))}
					</div>
					<p className="text-xs text-yellow-600 mt-2">
						❗ Выберите даты вне этих периодов для бронирования
					</p>
				</>
			) : (
				<>
					<div className="flex items-center gap-2">
						<Check className="text-green-600" size={18} />
						<span className="font-medium text-green-800">
							Нет текущих бронирований
						</span>
					</div>
					<p className="text-sm text-green-700 mt-1">
						Вы можете забронировать этот номер на любые даты
					</p>
				</>
			)}
		</div>
	)
}
