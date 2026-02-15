import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '../../store/app.store'
import { ConfirmModal } from '../../components/common/confirm-modal'
import { useConfirmModal } from '../../hooks/useConfirmModal'

const roomSchema = yup.object().shape({
	title: yup.string().required('Название обязательно').min(3).max(100),
	description: yup.string().required('Описание обязательно').min(10).max(1000),
	price: yup.number().required('Цена обязательна').min(1).max(1000000),
	maxGuests: yup.number().required('Количество гостей обязательно').min(1).max(20),
})

export default function RoomEditForm({ room, onCancel, onSuccess }) {
	const { updateRoom, loading, error, clearError } = useAppStore()
	const [images, setImages] = useState(room?.images || [])
	const [imageInput, setImageInput] = useState('')

	const { modalState, openDeleteConfirm, closeModal, handleConfirm } = useConfirmModal()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(roomSchema),
		defaultValues: {
			title: room?.title || '',
			description: room?.description || '',
			price: room?.price || 0,
			maxGuests: room?.maxGuests || 1,
		},
	})

	const handleAddImage = () => {
		if (!imageInput.trim()) return
		if (!images.includes(imageInput)) {
			setImages([...images, imageInput])
			setImageInput('')
		}
	}

	const handleRemoveImage = (index) => {
		setImages(images.filter((_, i) => i !== index))
		closeModal()
	}

	const onSubmit = async (data) => {
		if (images.length === 0) {
			alert('Добавьте хотя бы одно изображение')
			return
		}

		clearError()

		const roomData = {
			...data,
			images: images,
		}

		const result = await updateRoom(room.id, roomData)

		if (result.success) {
			if (onSuccess) onSuccess(result.room)
		}
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h2 className="text-xl font-bold text-gray-900 mb-6">Редактировать номер</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Название номера *
					</label>
					<input
						type="text"
						placeholder="Например: Люкс с видом на море"
						className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
						{...register('title')}
					/>
					{errors.title && (
						<p className="mt-1.5 text-sm text-red-600">
							{errors.title.message}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Описание *
					</label>
					<textarea
						placeholder="Подробное описание номера, удобств и особенностей..."
						rows={4}
						className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none resize-none"
						{...register('description')}
					/>
					{errors.description && (
						<p className="mt-1.5 text-sm text-red-600">
							{errors.description.message}
						</p>
					)}
				</div>

				<div className="grid gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Цена за ночь (₽) *
						</label>
						<input
							type="number"
							placeholder="5000"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
							{...register('price', { valueAsNumber: true })}
						/>
						{errors.price && (
							<p className="mt-1.5 text-sm text-red-600">
								{errors.price.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Максимум гостей *
						</label>
						<input
							type="number"
							placeholder="2"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
							{...register('maxGuests', { valueAsNumber: true })}
						/>
						{errors.maxGuests && (
							<p className="mt-1.5 text-sm text-red-600">
								{errors.maxGuests.message}
							</p>
						)}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Изображения номера *
						<span className="text-xs text-gray-500 ml-2">
							{images.length} добавлено
						</span>
					</label>

					<div className="flex gap-2 mb-4">
						<input
							type="text"
							value={imageInput}
							onChange={(e) => setImageInput(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' &&
								(e.preventDefault(), handleAddImage())
							}
							className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
							placeholder="https://example.com/room-image.jpg"
						/>
						<button
							type="button"
							onClick={handleAddImage}
							className="px-4 py-2 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45]"
						>
							<Plus size={20} />
						</button>
					</div>

					{images.length > 0 ? (
						<div className="space-y-3 p-2 border border-gray-200 rounded-lg">
							{images.map((img, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
								>
									<div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
										<img
											src={img}
											alt={`Изображение ${index + 1}`}
											className="w-full h-full object-cover"
											onError={(e) => {
												e.target.src =
													'https://via.placeholder.com/100x100?text=Ошибка+загрузки'
											}}
										/>
									</div>
									<div className="flex-1">
										<p className="text-sm text-gray-700">{img}</p>
									</div>
									<button
										type="button"
										onClick={() =>
											openDeleteConfirm(
												index,
												`изображение ${index + 1}`,
												(data) => handleRemoveImage(data.id),
											)
										}
										className="p-1.5 text-red-400 hover:text-red-600"
										title="Удалить"
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
							<ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
							<p className="text-gray-500">Добавьте изображения номера</p>
						</div>
					)}
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
						{error}
					</div>
				)}

				<div className="flex gap-3 pt-4">
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
					>
						Отмена
					</button>

					<button
						type="submit"
						disabled={loading || images.length === 0}
						className="flex-1 px-4 py-3 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45] disabled:opacity-50"
					>
						{loading ? 'Сохранение...' : 'Сохранить изменения'}
					</button>
				</div>
			</form>

			<ConfirmModal
				isOpen={modalState.isOpen}
				title="Удаление изображения"
				message="Вы уверены, что хотите удалить это изображение?"
				confirmText="Удалить"
				cancelText="Отмена"
				type="danger"
				variant="danger"
				loading={modalState.loading}
				onConfirm={handleConfirm}
				onCancel={closeModal}
			/>
		</div>
	)
}
