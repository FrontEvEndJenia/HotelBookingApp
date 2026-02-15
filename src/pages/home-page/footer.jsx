import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react'

export const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white pt-12 pb-8">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-2xl font-bold mb-4">Grand Palace Hotel</h3>
						<p className="text-gray-300 mb-4">
							Мы работаем для Вас с 1995 года. Комфорт, роскошь и
							незабываемый отдых.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://facebook.com"
								target="_blank"
								className="text-gray-400 hover:text-white"
							>
								<Facebook
									size={24}
									className="text-gray-400 hover:text-blue-600 transition-colors"
								/>
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								className="text-gray-400 hover:text-white"
							>
								<Instagram
									size={24}
									className="text-gray-400 hover:text-pink-600 transition-colors"
								/>
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								className="text-gray-400 hover:text-white"
							>
								<Twitter
									size={24}
									className="text-gray-400 hover:text-blue-400 transition-colors"
								/>
							</a>
						</div>
					</div>

					<div>
						<h4 className="text-xl font-semibold mb-4">Контакты</h4>
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<MapPin size={20} className="text-[#6C6C6C]" />
								<span className="text-gray-300">
									г. Москва, ул. Пушкина, 123
								</span>
							</div>
							<div className="flex items-center gap-3">
								<Phone size={20} className="text-[#6C6C6C]" />
								<span className="text-gray-300">+7 (495) 123-45-67</span>
							</div>
							<div className="flex items-center gap-3">
								<Mail size={20} className="text-[#6C6C6C]" />
								<span className="text-gray-300">info@grandpalace.ru</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-gray-300">Круглосуточно 24/7</span>
							</div>
						</div>
					</div>

					<div>
						<ul className="space-y-2">
							<li>
								<a href="#" className="text-gray-300 hover:text-white">
									Номера и цены
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-300 hover:text-white">
									Бронирование
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-300 hover:text-white">
									Услуги
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-300 hover:text-white">
									Ресторан
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-300 hover:text-white">
									Конференц-залы
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
					<p>
						© {new Date().getFullYear()} Grand Palace Hotel. Все права
						защищены.
					</p>
				</div>
			</div>
		</footer>
	)
}
