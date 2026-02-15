import { verifyToken } from '../utils/token.js'
import { User } from '../models/user.js'
import { mapUser } from '../mappers/mapUser.js'

export const authenticated = async (req, res, next) => {
	const decodedToken = verifyToken(req.cookies.token)
	const user = await User.findOne({ _id: decodedToken.id })
	if (!user) {
		res.send({ error: 'User not authenticated' })
		return
	}
	req.user = mapUser(user)
	next()
}
