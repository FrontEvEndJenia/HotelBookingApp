import { AlertTriangle, Trash2, AlertCircle, Info, CheckCircle } from 'lucide-react'

export const ConfirmModal = ({
	isOpen,
	title = 'Подтверждение действия',
	message,
	confirmText = 'Подтвердить',
	cancelText = 'Отмена',
	type = 'warning',
	variant = 'default',
	loading = false,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null

	const getTypeStyles = () => {
		switch (type) {
			case 'danger':
				return {
					bg: 'bg-red-100',
					text: 'text-red-600',
					icon: AlertTriangle,
					iconColor: 'text-red-600',
					button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
				}
			case 'success':
				return {
					bg: 'bg-green-100',
					text: 'text-green-600',
					icon: CheckCircle,
					iconColor: 'text-green-600',
					button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
				}
			case 'info':
				return {
					bg: 'bg-blue-100',
					text: 'text-blue-600',
					icon: Info,
					iconColor: 'text-blue-600',
					button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
				}
			case 'warning':
			default:
				return {
					bg: 'bg-yellow-100',
					text: 'text-yellow-600',
					icon: AlertTriangle,
					iconColor: 'text-yellow-600',
					button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
				}
		}
	}

	const getVariantStyles = () => {
		switch (variant) {
			case 'danger':
				return {
					title: 'Удаление',
					defaultTitle: 'Удаление',
					icon: Trash2,
				}
			case 'success':
				return {
					title: 'Успешно',
					defaultTitle: 'Подтверждение',
					icon: CheckCircle,
				}
			default:
				return {
					title: title,
					defaultTitle: 'Подтверждение',
					icon: AlertCircle,
				}
		}
	}

	const styles = getTypeStyles()
	const variantStyles = getVariantStyles()
	const IconComponent = variant === 'default' ? styles.icon : variantStyles.icon
	const modalTitle = title || variantStyles.title

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn">
			<div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all duration-300 scale-100 animate-scaleIn">
				<div className="flex items-start gap-4 mb-4">
					<div className={`p-2 rounded-full ${styles.bg} flex-shrink-0`}>
						<IconComponent className={styles.iconColor} size={24} />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							{modalTitle}
						</h3>
						<p className="text-gray-600">{message}</p>
					</div>
				</div>
				<div className="flex justify-end gap-3 mt-6">
					<button
						onClick={onCancel}
						disabled={loading}
						className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className={`px-4 py-2 rounded-lg text-white ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
					>
						{loading ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Обработка...
							</div>
						) : (
							confirmText
						)}
					</button>
				</div>
			</div>
		</div>
	)
}
