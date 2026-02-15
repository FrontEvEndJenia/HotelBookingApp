import { Routes, Route } from 'react-router-dom'
import { StoreProvider } from './providers/store-provider'
import {
	HomePage,
	SignUpPage,
	SignInPage,
	RoomDetailPage,
	MyBookingsPage,
	RoomEditPage,
	NotFoundPage,
} from './pages'
import { Layout, AdminLayout, AdminUsers, AdminBookings } from './components'

export const App = () => {
	return (
		<StoreProvider>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<SignUpPage />} />
				<Route path="/login" element={<SignInPage />} />

				<Route element={<Layout />}>
					<Route path="/rooms/:id" element={<RoomDetailPage />} />
					<Route path="/my-bookings" element={<MyBookingsPage />} />
					<Route path="/rooms/:id/edit" element={<RoomEditPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>

				<Route path="/admin" element={<AdminLayout />}>
					<Route path="users" element={<AdminUsers />} />
					<Route path="bookings" element={<AdminBookings />} />
					<Route path="*" element={<AdminBookings />} />
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</StoreProvider>
	)
}
