import { ButtonSpinner } from './loading-spinner'

export const FormButton = ({
	type = 'button',
	children,
	onClick,
	disabled = false,
	loading = false,
	variant = 'primary',
	className = '',
	fullWidth = false,
}) => {
	const variants = {
		primary:
			'bg-gradient-to-r from-[#6F7B55] to-[#93A06C] text-white hover:from-[#7F8B65] hover:to-[#A3B07C]',
		secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
		danger: 'bg-red-500 text-white hover:bg-red-600',
		outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={`
          ${fullWidth ? 'w-full' : ''}
          px-4 py-3 rounded-lg font-medium transition-colors
          ${variants[variant] || variants.primary}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
		>
			{loading ? <ButtonSpinner /> : children}
		</button>
	)
}
