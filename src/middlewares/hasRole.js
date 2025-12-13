export const hasRole = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.roleId)) {
			res.send({ error: 'Access denied' })
			return
		}
		next()
	}
}
