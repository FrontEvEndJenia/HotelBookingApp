import { Link } from 'react-router-dom'
import { User, Edit } from 'lucide-react'
import { useRooms, useCurrentUser } from '../../hooks'
import {
	Pagination,
	SearchBar,
	LoadingSpinner,
	InlineSpinner,
	ErrorMessage,
} from '../../components'
import { formatPrice } from '../../utils/formatters'

export const RoomsList = () => {
	const {
		rooms,
		loading,
		error,
		currentPage,
		lastPage,
		total,
		handlePageChange,
		searchTerm,
		setSearchTerm,
		refreshRooms,
		clearError,
	} = useRooms()

	const { canAccessAdmin } = useCurrentUser()

	if (loading && rooms.length === 0) {
		return <LoadingSpinner fullScreen text="Загрузка номеров..." />
	}

	return (
		<section id="rooms-section" className="py-12">
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-12">
					<h1 className="text-3xl font-semibold text-gray-600">
						Выберите подходящий номер для незабываемого отдыха
					</h1>
				</div>

				<div className="mb-8 max-w-md mx-auto">
					<SearchBar
						value={searchTerm}
						placeholder="Поиск по названию или описанию..."
						onSearch={setSearchTerm}
					/>
				</div>

				{!loading && rooms.length > 0 && (
					<div className="mb-6 text-gray-600 text-sm">
						<p>
							Показано {rooms.length} из {total} номеров
							{lastPage > 1 && ` (страница ${currentPage} из ${lastPage})`}
						</p>
					</div>
				)}

				{error && (
					<div className="mb-6">
						<ErrorMessage error={error} onClose={clearError} />
					</div>
				)}

				{rooms.length === 0 && !loading ? (
					<EmptyState
						hasSearchTerm={!!searchTerm}
						onClearSearch={() => setSearchTerm('')}
						onReload={refreshRooms}
					/>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
							{rooms.map((room) => (
								<RoomCard
									key={room.id}
									room={room}
									canEdit={canAccessAdmin}
								/>
							))}
						</div>

						{lastPage > 1 && total > 0 && (
							<Pagination
								currentPage={currentPage}
								lastPage={lastPage}
								totalItems={total}
								onPageChange={handlePageChange}
								itemsPerPage={12}
								className="py-6 border-t border-gray-200"
							/>
						)}
					</>
				)}

				{loading && rooms.length > 0 && (
					<div className="text-center py-4">
						<InlineSpinner text="Загрузка дополнительных номеров..." />
					</div>
				)}
			</div>
		</section>
	)
}

const RoomCard = ({ room, canEdit }) => {
	const mainImage =
		room.images?.[0] ||
		'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
	const roomType = room.roomType || 'стандарт'

	return (
		<div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
			{canEdit && (
				<Link
					to={`/rooms/${room.id}/edit`}
					className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-lg hover:bg-white transition-colors shadow-md opacity-0 group-hover:opacity-100"
					title="Редактировать номер"
				>
					<Edit size={18} className="text-gray-600" />
				</Link>
			)}

			<div className="relative h-48 overflow-hidden">
				<img
					src={mainImage}
					alt={room.title}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					onError={(e) => {
						e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
					}}
				/>
				<div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded text-sm">
					{formatPrice(room.price)} ₽/ночь
				</div>
			</div>

			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
					{room.title}
				</h3>

				<p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
					{room.description || 'Описание отсутствует'}
				</p>

				<div className="flex items-center justify-between text-gray-700 text-sm mb-4">
					<div className="flex items-center gap-1">
						<User size={16} />
						<span>До {room.maxGuests || 2} чел.</span>
					</div>
					<div className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">
						{roomType}
					</div>
				</div>

				<Link
					to={`/rooms/${room.id}`}
					className="block w-full bg-gradient-to-r from-[#6F7B55] to-[#93A06C] text-white text-center py-2.5 rounded hover:from-[#7F8B65] hover:to-[#A3B07C] transition-all duration-300 font-medium hover:shadow-md"
				>
					Подробнее
				</Link>
			</div>
		</div>
	)
}

const EmptyState = ({ hasSearchTerm, onClearSearch, onReload }) => (
	<div className="text-center py-12">
		<div className="max-w-md mx-auto">
			<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
				<svg
					className="w-12 h-12 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
			</div>

			<h3 className="text-xl font-semibold text-gray-900 mb-2">
				{hasSearchTerm ? 'Номера не найдены' : 'Пока нет доступных номеров'}
			</h3>

			<p className="text-gray-600 mb-6">
				{hasSearchTerm
					? 'Попробуйте изменить параметры поиска'
					: 'Номера скоро появятся, пожалуйста, зайдите позже'}
			</p>

			<div className="flex gap-3 justify-center">
				{hasSearchTerm ? (
					<button
						onClick={onClearSearch}
						className="px-4 py-2 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45] transition-colors"
					>
						Сбросить поиск
					</button>
				) : (
					<button
						onClick={onReload}
						className="px-4 py-2 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45] transition-colors"
					>
						Обновить
					</button>
				)}

				<Link
					to="/"
					className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
				>
					На главную
				</Link>
			</div>
		</div>
	</div>
)
