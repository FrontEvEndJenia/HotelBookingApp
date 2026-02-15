import jwt from 'jsonwebtoken'

const secretKey = 'secretKey'

export const generateToken = (userId) => {
	return jwt.sign({ id: userId }, secretKey, { expiresIn: '30d' })
}

export const verifyToken = (token) => {
	return jwt.verify(token, secretKey)
}
