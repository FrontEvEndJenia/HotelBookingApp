import { Rooms } from '../models/rooms.js'

export const editRoom = async (roomId, updatedRoom) => {
	const newRoom = await Rooms.findByIdAndUpdate(roomId, updatedRoom, {
		returnDocument: 'after',
	})
	return newRoom
}

export const getRooms = async (page = 1, limit = 12, search = '', filters = {}) => {
	const query = {}

	if (search) {
		query.title = { $regex: search, $options: 'i' }
	}

	if (filters.roomType) {
		query.roomType = filters.roomType
	}

	if (filters.minPrice || filters.maxPrice) {
		query.price = {}
		if (filters.minPrice) query.price.$gte = Number(filters.minPrice)
		if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice)
	}

	if (filters.guests) {
		query.maxGuests = { $gte: Number(filters.guests) }
	}

	const [rooms, total] = await Promise.all([
		Rooms.find(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ price: 1 }),
		Rooms.countDocuments(query),
	])

	return {
		rooms,
		lastPage: Math.ceil(total / limit),
		total,
		page,
		limit,
	}
}

export const getRoom = (roomId) => {
	return Rooms.findById(roomId)
}

export const getRoomTypes = async () => {
	try {
		const roomTypes = await Rooms.aggregate([
			{
				$group: {
					_id: '$roomType',
					title: { $first: '$roomType' },
					description: { $first: '$description' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
					maxGuests: { $max: '$maxGuests' },
					images: { $first: '$images' },
					roomCount: { $sum: 1 },
				},
			},
			{
				$project: {
					type: '$_id',
					title: 1,
					description: 1,
					price: '$minPrice',
					maxGuests: 1,
					images: 1,
					roomCount: 1,
					priceRange: {
						min: '$minPrice',
						max: '$maxPrice',
					},
				},
			},
		])

		return roomTypes
	} catch (error) {
		throw new Error('Ошибка при получении типов номеров')
	}
}
