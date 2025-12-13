import { Rooms } from '../models/rooms.js'

export const editRoom = async (roomId, updatedRoom) => {
	const newRoom = await Rooms.findByIdAndUpdate(roomId, updatedRoom, {
		returnDocument: 'after',
	})
	return newRoom
}

// booking

// get list pagination search
export const getRooms = async (page = 1, limit = 9, search = '') => {
	const [rooms, total] = await Promise.all([
		Rooms.find({ title: { $regex: search, $options: 'i' } })
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ cost: 1 }),
		Rooms.countDocuments({ title: { $regex: search, $options: 'i' } }),
	])
	return {
		rooms,
		lastPage: Math.ceil(total / limit),
	}
}

// get room
export const getRoom = (roomId) => {
	return Rooms.findById(roomId)
}
