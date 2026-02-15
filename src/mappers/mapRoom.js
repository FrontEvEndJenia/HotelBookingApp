export const mapRoom = (room) => {
	return {
		id: room.id,
		title: room.title,
		roomNumber: room.roomNumber,
		roomType: room.roomType,
		maxGuests: room.maxGuests,
		description: room.description,
		images: room.images,
		price: room.price,
		bookings: room.bookings,
	}
}
