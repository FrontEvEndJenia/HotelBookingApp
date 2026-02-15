import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="max-w-sm text-center">
				<h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
				<h2 className="text-xl font-medium text-gray-600 mb-4">
					Страница не найдена
				</h2>
				<p className="text-gray-500 mb-8">Запрашиваемая страница не существует</p>
				<Link
					to="/"
					className="inline-flex items-center gap-2 px-6 py-3 bg-[#6F7B55] text-white rounded-lg hover:bg-[#5F6B45] transition-colors"
				>
					<ArrowLeft size={18} />
					<span>Вернуться на главную</span>
				</Link>
			</div>
		</div>
	)
}
