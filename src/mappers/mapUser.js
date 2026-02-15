export const mapUser = (user) => {
	return {
		id: user.id,
		login: user.login,
		roleId: user.role,
	}
}
