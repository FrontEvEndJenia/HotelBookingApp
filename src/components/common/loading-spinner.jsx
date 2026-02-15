export const LoadingSpinner = ({
	size = 'md',
	text = '',
	fullScreen = false,
	overlay = false,
	className = '',
	centerText = true,
}) => {
	const sizeClasses = {
		sm: 'h-6 w-6 border-2',
		md: 'h-12 w-12 border-3',
		lg: 'h-16 w-16 border-4',
	}

	const textSizes = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
	}

	const spinner = (
		<div className={`flex flex-col items-center justify-center ${className}`}>
			<div
				className={`animate-spin rounded-full border-b-2 border-[#6F7B55] mx-auto ${sizeClasses[size]}`}
				role="status"
				aria-label="Загрузка"
			>
				<span className="sr-only">Загрузка...</span>
			</div>
			{text && (
				<p
					className={`mt-3 text-gray-600 ${textSizes[size]} ${
						centerText ? 'text-center' : ''
					}`}
				>
					{text}
				</p>
			)}
		</div>
	)

	if (fullScreen) {
		return (
			<div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
				{spinner}
			</div>
		)
	}

	if (overlay) {
		return (
			<div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
				{spinner}
			</div>
		)
	}

	return spinner
}

export const InlineSpinner = ({ size = 'sm', text = '', className = '' }) => (
	<div className={`inline-flex items-center gap-2 ${className}`}>
		<div
			className={`animate-spin rounded-full h-4 w-4 border-b-2 border-[#6F7B55] ${
				size === 'lg' ? 'h-5 w-5' : ''
			}`}
		/>
		{text && <span className="text-gray-600 text-sm">{text}</span>}
	</div>
)

export const ButtonSpinner = ({ text = 'Загрузка...' }) => (
	<div className="flex items-center justify-center">
		<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
		{text}
	</div>
)

export const PageLoader = ({ text = 'Загрузка страницы...' }) => (
	<div className="min-h-screen flex items-center justify-center bg-gray-50">
		<LoadingSpinner size="lg" text={text} />
	</div>
)

export const SectionLoader = ({ text = 'Загрузка...' }) => (
	<div className="py-12 flex items-center justify-center">
		<LoadingSpinner size="md" text={text} />
	</div>
)
