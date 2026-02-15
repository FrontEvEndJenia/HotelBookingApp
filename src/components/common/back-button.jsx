import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export const BackButton = ({
	label = 'Назад',
	variant = 'default',
	className = '',
	onClick,
}) => {
	const navigate = useNavigate()

	const variants = {
		default: 'text-gray-600 hover:text-gray-900',
		outline:
			'border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded',
		ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1 rounded',
	}

	const handleClick = (e) => {
		if (onClick) {
			onClick(e)
		} else {
			navigate(-1)
		}
	}

	return (
		<button
			onClick={handleClick}
			className={`inline-flex items-center gap-2 transition-colors text-sm font-medium ${variants[variant]} ${className}`}
		>
			<ArrowLeft size={18} />
			<span>{label}</span>
		</button>
	)
}
