import mongoose from 'mongoose'
import validator from 'validator'

const RoomsSchema = mongoose.Schema(
	{
		title: { type: String, required: true },
		roomNumber: { type: Number, required: true },
		roomType: { type: String, required: true },
		maxGuests: { type: Number, required: true },
		description: { type: String, required: true },
		images: [
			{
				type: String,
				required: true,
				validate: {
					validator: validator.isURL,
					message: 'Image should be a valid url',
				},
			},
		],
		price: { type: Number, required: true },
		bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
	},
	{ timestamps: true },
)

export const Rooms = mongoose.model('Rooms', RoomsSchema)
