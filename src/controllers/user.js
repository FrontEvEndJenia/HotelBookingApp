import bcrypt from 'bcrypt'
import { User } from '../models/user.js'
import { mapUser } from '../mappers/mapUser.js'
import { generateToken } from '../utils/token.js'
import { roles } from '../constants/roles.js'

export const register = async (login, password) => {
	if (!password) {
		throw new Error('Password is empty')
	}
	const passwordHash = await bcrypt.hash(password, 10)
	const user = await User.create({ login, password: passwordHash })
	const token = generateToken(user.id)
	return { token, user: mapUser(user) }
}

export const login = async (login, password) => {
	if (!login || !password) {
		throw new Error('Login or password is empty')
	}
	const user = await User.findOne({ login })
	if (!user) {
		throw new Error('User not found')
	}
	const passwordMatch = await bcrypt.compare(password, user.password)
	if (!passwordMatch) {
		throw new Error('Invalid password')
	}
	const token = generateToken(user.id)
	return { token, user: mapUser(user) }
}

export const getUsers = () => {
	return User.find()
}
export const getRoles = () => {
	return [
		{ id: roles.ADMIN, name: 'admin' },
		{ id: roles.MODERATOR, name: 'moderator' },
		{ id: roles.USER, name: 'user' },
	]
}

export const updateUserRole = async (userId, newRoleId) => {
	return User.findByIdAndUpdate(
		userId,
		{ role: newRoleId },
		{ returnDocument: 'after' },
	)
}

export const deleteUser = async (id) => {
	try {
		await User.findByIdAndDelete(id)
	} catch (error) {
		console.error('Error deleting user:', error)
	}
}
