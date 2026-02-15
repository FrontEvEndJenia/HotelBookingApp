import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../../hooks'

export const MainHeader = () => {
	const { user, canAccessAdmin, logoutWithRedirect } = useAuth()

	return (
		<header className="bg-white shadow-sm border-b border-gray-200">
			<div className="mx-auto px-6 h-14 flex items-center justify-between">
				<Link
					to="/"
					className="text-gray-900 font-bold hover:text-[#6F7B55] transition-colors"
				>
					Grand Palace Hotel
				</Link>

				<nav className="flex items-center space-x-3">
					{user ? (
						<>
							<span className="text-gray-700 font-medium text-sm">
								{user.login || 'Пользователь'}
							</span>

							<Link
								to="/my-bookings"
								className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-sm"
							>
								Мои брони
							</Link>

							{canAccessAdmin && (
								<Link
									to="/admin/users"
									className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-all border border-purple-200 text-sm flex items-center gap-2"
								>
									<Shield size={16} />
									Админ
								</Link>
							)}

							<button
								onClick={() => logoutWithRedirect()}
								className="text-white px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg text-sm font-medium"
							>
								Выйти
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-all text-sm"
							>
								Вход
							</Link>
							<Link
								to="/register"
								className="text-white px-4 py-2 rounded-full bg-black hover:bg-gray-800 transition-all shadow-lg text-sm"
							>
								Регистрация
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}
