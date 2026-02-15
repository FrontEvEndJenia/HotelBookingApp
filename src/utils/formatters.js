export const formatPrice = (price) => {
	return new Intl.NumberFormat('ru-RU').format(price || 0)
}

export const formatDate = (dateString) => {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	} catch {
		return dateString
	}
}

export const calculateNights = (arrivalDate, departureDate) => {
	if (!arrivalDate || !departureDate) return 0

	try {
		const start = new Date(arrivalDate)
		const end = new Date(departureDate)

		start.setHours(0, 0, 0, 0)
		end.setHours(0, 0, 0, 0)

		const timeDiff = end.getTime() - start.getTime()
		const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

		return nights > 0 ? nights : 0
	} catch (error) {
		console.error('Ошибка в calculateNights:', error)
		return 0
	}
}
