import mongoose from 'mongoose'

const BookingSchema = mongoose.Schema(
	{
		arrivalDate: { type: Date, required: true },
		departureDate: { type: Date, required: true },
		guestsCount: { type: Number, required: true },
		bookingOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		room: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },
	},
	{ timestamps: true },
)

export const Booking = mongoose.model('Booking', BookingSchema)
