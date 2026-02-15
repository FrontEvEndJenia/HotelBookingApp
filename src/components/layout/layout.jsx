import { Outlet } from 'react-router-dom'
import { MainHeader } from '../../components'
import { Footer } from '../../pages'

export const Layout = () => {
	return (
		<div className="min-h-screen bg-white font-inter">
			<MainHeader />
			<main className="py-8">
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}
