import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRoomStore } from '../../../store/room.store'

export const RoomGallery = ({ images }) => {
	const { currentImageIndex, nextImage, prevImage, setCurrentImageIndex } =
		useRoomStore()

	if (!images || images.length === 0) {
		return (
			<div className="mb-6">
				<div className="relative rounded-lg overflow-hidden bg-gray-100 h-96">
					<img
						src="/default-room.jpg"
						alt="Номер"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
		)
	}

	return (
		<div className="mb-6">
			<div className="relative rounded-lg overflow-hidden bg-gray-100 h-96">
				<img
					src={images[currentImageIndex] || '/default-room.jpg'}
					alt="Номер"
					className="w-full h-full object-cover"
					onError={(e) => {
						e.target.src = '/default-room.jpg'
					}}
				/>

				{images.length > 1 && (
					<>
						<button
							onClick={prevImage}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
						>
							<ChevronLeft size={24} />
						</button>
						<button
							onClick={nextImage}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
						>
							<ChevronRight size={24} />
						</button>

						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentImageIndex(index)}
									className={`w-2 h-2 rounded-full ${
										index === currentImageIndex
											? 'bg-white'
											: 'bg-white/50'
									}`}
								/>
							))}
						</div>
					</>
				)}
			</div>

			{images.length > 1 && (
				<div className="grid grid-cols-4 gap-2 mt-2">
					{images.map((img, index) => (
						<button
							key={index}
							onClick={() => setCurrentImageIndex(index)}
							className={`h-20 rounded overflow-hidden ${
								index === currentImageIndex
									? 'ring-2 ring-[#6F7B55]'
									: 'opacity-70'
							}`}
						>
							<img
								src={img}
								alt={`Фото ${index + 1}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									e.target.src = '/default-room.jpg'
								}}
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
