import mongoose from 'mongoose'
import { roles } from '../constants/roles.js'

const UserSchema = mongoose.Schema(
	{
		login: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			unique: true,
		},
		role: {
			type: Number,
			default: roles.USER,
		},
	},
	{ timestamps: true },
)

export const User = mongoose.model('User', UserSchema)
