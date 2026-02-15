import { Outlet, Link, useLocation } from 'react-router-dom'
import { Users, Calendar, Shield, Home } from 'lucide-react'

export const AdminLayout = () => {
	const location = useLocation()

	const tabs = [
		{
			id: 'users',
			name: 'Пользователи',
			icon: Users,
			path: '/admin/users',
		},
		{
			id: 'bookings',
			name: 'Бронирования',
			icon: Calendar,
			path: '/admin/bookings',
		},
	]

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b border-gray-200">
				<div className="mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-3">
							<Shield className="w-8 h-8 text-[#6F7B55]" />
							<h1 className="text-xl font-bold text-gray-900">
								Панель администратора
							</h1>
						</div>
						<Link
							to="/"
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
							title="На главную"
						>
							<Home size={18} />
							<span className="text-sm font-medium">На главную</span>
						</Link>
					</div>
				</div>
			</div>

			<div className="bg-white border-b border-gray-200">
				<div className="mx-auto px-4">
					<div className="flex space-x-1">
						{tabs.map((tab) => {
							const isActive = location.pathname === tab.path
							const Icon = tab.icon

							return (
								<Link
									key={tab.id}
									to={tab.path}
									className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg
                    ${
						isActive
							? 'bg-gray-50 text-gray-900 border-t border-l border-r border-gray-200'
							: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
					}
                  `}
								>
									<Icon size={18} />
									{tab.name}
								</Link>
							)
						})}
					</div>
				</div>
			</div>

			<div className="mx-auto p-4">
				<Outlet />
			</div>
		</div>
	)
}
