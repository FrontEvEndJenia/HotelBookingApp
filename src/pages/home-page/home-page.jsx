import { MainHeader } from '../../components'
import { RoomsList, Footer } from '../../pages'

export const HomePage = () => {
	return (
		<div className="min-h-screen bg-white font-inter">
			<MainHeader />

			<section className="relative bg-gray-900">
				<div className="relative h-[600px] overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{
							backgroundImage:
								'url(https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)',
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent"></div>

					<div className="relative h-full mx-auto px-6 flex items-center">
						<div className="max-w-2xl">
							<h1 className="text-white font-inter leading-tight text-5xl mb-6">
								Роскошь и
								<br />
								Комфорт.
							</h1>
							<p className="text-white text-xl">
								Grand Palace Hotel - ваш идеальный выбор для незабываемого
								отдыха в самом сердце города
							</p>
						</div>
					</div>
				</div>
			</section>

			<div className="bg-white">
				<RoomsList />
			</div>

			<Footer />
		</div>
	)
}
