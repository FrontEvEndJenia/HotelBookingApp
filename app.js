import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import './src/models/booking.js'
import './src/models/rooms.js'
import './src/models/user.js'
import {
	register,
	login,
	getUsers,
	getRoles,
	deleteUser,
	updateUserRole,
} from './src/controllers/user.js'
import { editRoom, getRoom, getRooms, getRoomTypes } from './src/controllers/rooms.js'
import {
	addBooking,
	getUserBookings,
	cancelBooking,
	isRoomAvailable,
} from './src/controllers/booking.js'
import { authenticated } from './src/middlewares/authenticated.js'
import { hasRole } from './src/middlewares/hasRole.js'
import { roles } from './src/constants/roles.js'
import { mapRoom } from './src/mappers/mapRoom.js'
import { Rooms } from './src/models/rooms.js'
import { Booking } from './src/models/booking.js'

const port = 3001
const app = express()

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
	}),
)

app.use(cookieParser())
app.use(express.json())

app.post('/register', async (req, res) => {
	try {
		const { token, user } = await register(req.body.login, req.body.password)
		res.cookie('token', token, { httpOnly: true }).send({ error: null, user })
	} catch (e) {
		res.send({ error: e.message || 'Register server error' })
	}
})

app.post('/login', async (req, res) => {
	try {
		const { token, user } = await login(req.body.login, req.body.password)
		res.cookie('token', token, { httpOnly: true }).send({ error: null, user })
	} catch (e) {
		res.send({ error: e.message || 'Login server error' })
	}
})

app.post('/logout', (req, res) => {
	try {
		res.clearCookie('token').send({ error: null })
	} catch (e) {
		res.send({ error: e.message || 'Logout server error' })
	}
})

app.get('/room-types', async (req, res) => {
	try {
		const roomTypes = await getRoomTypes()
		res.send({ error: null, data: roomTypes })
	} catch (e) {
		res.send({ error: e.message || 'Get room types server error' })
	}
})

app.get('/rooms', async (req, res) => {
	try {
		const { rooms, lastPage, total } = await getRooms(
			req.query.page,
			req.query.limit,
			req.query.search,
		)
		res.send({ error: null, data: { rooms: rooms.map(mapRoom), lastPage, total } })
	} catch (e) {
		res.send({ error: e.message || 'Get rooms server error' })
	}
})

app.get('/rooms/:id', async (req, res) => {
	try {
		const room = await getRoom(req.params.id)
		res.send({ error: null, data: mapRoom(room) })
	} catch (e) {
		res.send({ error: e.message || 'Get room server error' })
	}
})

app.get('/rooms/:id/availability', async (req, res) => {
	try {
		const { arrivalDate, departureDate } = req.query

		if (!arrivalDate || !departureDate) {
			return res.status(400).json({
				success: false,
				error: 'arrivalDate and departureDate are required',
			})
		}

		const availability = await isRoomAvailable(
			req.params.id,
			arrivalDate,
			departureDate,
		)

		res.json({
			success: true,
			data: availability,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			error: 'Failed to check availability',
		})
	}
})

app.get('/rooms/:id/booked-dates', async (req, res) => {
	try {
		const roomId = req.params.id

		const bookings = await Booking.find({
			room: roomId,
			departureDate: { $gt: new Date() },
		}).select('arrivalDate departureDate')

		const bookedDates = bookings.map((booking) => ({
			start: booking.arrivalDate,
			end: booking.departureDate,
		}))

		res.send({ error: null, data: bookedDates })
	} catch (e) {
		console.error('Error getting booked dates:', e)
		res.send({ error: e.message || 'Get booked dates server error' })
	}
})

app.use(authenticated)

app.get('/users', hasRole([roles.ADMIN]), async (req, res) => {
	try {
		const users = await getUsers()
		res.send({ error: null, data: users })
	} catch (e) {
		res.send({ error: e.message || 'Get users server error' })
	}
})

app.get('/users/roles', hasRole([roles.ADMIN]), (req, res) => {
	try {
		const roles = getRoles()
		res.send({ error: null, data: roles })
	} catch (e) {
		res.send({ error: e.message || 'Get roles server error' })
	}
})

app.patch('/users/:id', hasRole([roles.ADMIN]), async (req, res) => {
	try {
		const updatedUser = await updateUserRole(req.params.id, req.body.roleId)
		res.send({ error: null, data: updatedUser })
	} catch (e) {
		res.send({ error: e.message || 'Update server error' })
	}
})

app.delete('/users/:id', hasRole([roles.ADMIN]), async (req, res) => {
	try {
		await deleteUser(req.params.id)
		res.send({ error: null })
	} catch (e) {
		res.send({ error: e.message || 'Delete server error' })
	}
})

app.patch(
	'/rooms/:id/edit',
	hasRole([roles.ADMIN, roles.MODERATOR]),
	async (req, res) => {
		try {
			const updatedRoom = await editRoom(req.params.id, {
				title: req.body.title,
				description: req.body.description,
				maxGuests: req.body.maxGuests,
				images: req.body.images,
				price: req.body.price,
			})
			res.send({ error: null, data: updatedRoom })
		} catch (e) {
			res.send({ error: e.message || 'Update server error' })
		}
	},
)

app.post('/rooms', hasRole([roles.ADMIN]), async (req, res) => {
	try {
		const newRoom = await Rooms.create({
			title: req.body.title,
			roomNumber: req.body.roomNumber,
			roomType: req.body.roomType,
			maxGuests: req.body.maxGuests,
			description: req.body.description,
			images: req.body.images,
			price: req.body.price,
			bookings: [],
		})
		res.send({ error: null, data: newRoom })
	} catch (e) {
		res.send({ error: e.message || 'Create room server error' })
	}
})

app.post('/rooms/:id/bookings', async (req, res) => {
	try {
		const newBooking = await addBooking(req.params.id, {
			...req.body,
			bookingOwner: req.user.id,
			room: req.params.id,
		})
		res.send({ error: null, data: newBooking })
	} catch (e) {
		console.error('Error:', e)
		res.send({ error: e.message || 'Create booking server error' })
	}
})

app.get('/my-bookings', getUserBookings)
app.delete('/my-bookings/:id', cancelBooking)

app.get('/admin/bookings', hasRole([roles.ADMIN, roles.MODERATOR]), async (req, res) => {
	try {
		const bookings = await Booking.find()
			.populate('bookingOwner', 'login')
			.populate('room', 'title price roomNumber')
			.sort({ createdAt: -1 })

		res.send({ error: null, data: bookings })
	} catch (e) {
		console.error('Error getting admin bookings:', e)
		res.send({ error: e.message || 'Get bookings server error' })
	}
})

app.delete(
	'/admin/bookings/:id',
	hasRole([roles.ADMIN, roles.MODERATOR]),
	async (req, res) => {
		try {
			const bookingId = req.params.id

			const booking = await Booking.findById(bookingId)
			if (!booking) {
				return res.send({ error: 'Booking not found', success: false })
			}

			await Booking.findByIdAndDelete(bookingId)

			await Rooms.findByIdAndUpdate(booking.room, {
				$pull: { bookings: bookingId },
			})

			res.send({
				error: null,
				success: true,
				message: 'Booking deleted successfully',
			})
		} catch (e) {
			console.error('Error deleting admin booking:', e)
			res.send({
				error: e.message || 'Delete booking server error',
				success: false,
			})
		}
	},
)

mongoose
	.connect('mongodb://user:mongopass@localhost:27017/HotelDb?authSource=admin')
	.then(() => {
		app.listen(port, () => {
			console.log(`Server started on port: ${port}`)
		})
	})
	.catch((err) => {
		console.error('MongoDB connection error:', err)
	})
