import { Rooms } from './src/models/rooms.js'

import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import {
	register,
	login,
	getUsers,
	getRoles,
	deleteUser,
} from './src/controllers/user.js'
import { editRoom, getRoom, getRooms } from './src/controllers/rooms.js'
import { authenticated } from './src/middlewares/authenticated.js'
import { hasRole } from './src/middlewares/hasRole.js'
import { roles } from './src/constants/roles.js'
import { updateUserRole } from './src/controllers/user.js'
import { mapRoom } from './src/mappers/mapRoom.js'
import {
	addBooking,
	getUserBookings,
	cancelBooking,
	isRoomAvailable,
	getAllBookings,
} from './src/controllers/booking.js'

const port = 3001
const app = express()

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

app.get('/rooms', async (req, res) => {
	try {
		const { rooms, lastPage } = await getRooms(
			req.query.page,
			req.query.limit,
			req.query.search,
		)
		res.send({ error: null, data: { rooms: rooms.map(mapRoom), lastPage } })
	} catch (e) {
		res.send({ error: e.message || 'Get rooms server error' })
	}
})

app.get('/room/:id', async (req, res) => {
	try {
		const room = await getRoom(req.params.id)
		res.send({ error: null, data: mapRoom(room) })
	} catch (e) {
		res.send({ error: e.message || 'Get room server error' })
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

app.patch('/rooms/:id', hasRole([roles.ADMIN]), async (req, res) => {
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
})

app.post('/rooms/:id/bookings', authenticated, async (req, res) => {
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

// my bookings
app.get('/my-bookings', authenticated, getUserBookings)
app.delete('/my-bookings/:id', authenticated, cancelBooking)

// Проверка доступности комнаты
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

///////////////// for me
app.post('/rooms', hasRole([roles.ADMIN]), async (req, res) => {
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
})

mongoose
	.connect('mongodb://user:mongopass@localhost:27017/HotelDb?authSource=admin')
	.then(() => {
		app.listen(port, () => {
			console.log(`Server started on port: ${port}`)
		})
	})
