import { useState } from 'react'
import { Trash2, UserCog, Check, X } from 'lucide-react'
import { useAdminUsers } from '../../hooks/useAdmin'
import { AdminPageHeader } from '../common/admin-page-header'
import { ConfirmModal } from '../common/confirm-modal'
import { ErrorMessage } from '../common/error-message'
import { LoadingSpinner } from '../common/loading-spinner'
import { useConfirmModal } from '../../hooks/useConfirmModal'

export const AdminUsers = () => {
	const {
		users,
		roles,
		loading,
		error,
		searchTerm,
		setSearchTerm,
		editingUserId,
		setEditingUserId,
		selectedRole,
		setSelectedRole,
		handleDeleteUser,
		handleRoleChange,
		isAdmin,
		clearError,
	} = useAdminUsers()

	const { modalState, openDeleteConfirm, closeModal, handleConfirm } = useConfirmModal()

	const [localError, setLocalError] = useState('')

	const getRoleName = (roleId) => {
		const role = roles.find((r) => r.id === roleId)
		return role ? role.name : 'Пользователь'
	}

	const getRoleColor = (roleId) => {
		switch (roleId) {
			case 0:
				return 'bg-purple-100 text-purple-800'
			case 1:
				return 'bg-orange-100 text-orange-800'
			case 2:
				return 'bg-blue-100 text-blue-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	if (loading) {
		return <LoadingSpinner fullScreen text="Загрузка пользователей..." />
	}

	return (
		<div className="max-w-7xl mx-auto">
			<AdminPageHeader
				title="Управление пользователями"
				subtitle={`Всего пользователей: ${users.length}`}
			/>

			<div className="p-6">
				<div className="mb-6">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Поиск по логину..."
						className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
					/>
				</div>

				{(error || localError) && (
					<ErrorMessage
						error={error || localError}
						onClose={() => {
							clearError()
							setLocalError('')
						}}
					/>
				)}

				{users.length === 0 && !loading ? (
					<div className="p-8 text-center text-gray-500">
						Пользователей не найдено
					</div>
				) : (
					<div className="space-y-4">
						{users.map((user) => (
							<div
								key={user._id}
								className="bg-white border border-gray-200 rounded-lg p-4"
							>
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-r from-[#6F7B55]/20 to-[#93A06C]/20 rounded-full flex items-center justify-center">
											<span className="text-lg font-medium text-[#6F7B55]">
												{user.login?.charAt(0).toUpperCase()}
											</span>
										</div>
										<div>
											<h3 className="font-medium">{user.login}</h3>
											<div className="flex items-center gap-2 mt-1">
												{editingUserId === user._id ? (
													<div className="flex items-center gap-2">
														<select
															value={
																selectedRole || user.role
															}
															onChange={(e) =>
																setSelectedRole(
																	e.target.value,
																)
															}
															className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#6F7B55] outline-none"
														>
															{roles.map((role) => (
																<option
																	key={role.id}
																	value={role.id}
																>
																	{role.name}
																</option>
															))}
														</select>
														<button
															onClick={async () => {
																try {
																	await handleRoleChange(
																		user._id,
																	)
																} catch (err) {
																	setLocalError(
																		err.message ||
																			'Ошибка при изменении роли',
																	)
																}
															}}
															className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg"
															title="Сохранить"
														>
															<Check size={16} />
														</button>
														<button
															onClick={() => {
																setEditingUserId(null)
																setSelectedRole('')
															}}
															className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
															title="Отмена"
														>
															<X size={16} />
														</button>
													</div>
												) : (
													<>
														<span
															className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
																user.role,
															)}`}
														>
															{getRoleName(user.role)}
														</span>
														{!isAdmin(user) && (
															<button
																onClick={() => {
																	setEditingUserId(
																		user._id,
																	)
																	setSelectedRole(
																		user.role.toString(),
																	)
																}}
																className="p-1.5 text-gray-400 hover:text-[#6F7B55] hover:bg-gray-100 rounded-lg"
																title="Изменить роль"
															>
																<UserCog size={16} />
															</button>
														)}
													</>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										{!isAdmin(user) && (
											<button
												onClick={() =>
													openDeleteConfirm(
														user._id,
														user.login,
														async (data) => {
															try {
																await handleDeleteUser(
																	data.id,
																)
															} catch (err) {
																setLocalError(
																	err.message ||
																		'Ошибка при удалении',
																)
																throw err
															}
														},
													)
												}
												className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
												title="Удалить пользователя"
											>
												<Trash2 size={18} />
											</button>
										)}
										{isAdmin(user) && (
											<span className="text-sm text-gray-500 italic">
												Администратор
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				<ConfirmModal
					isOpen={modalState.isOpen}
					title={modalState.title}
					message={modalState.message}
					confirmText={modalState.confirmText}
					cancelText={modalState.cancelText}
					type={modalState.type}
					variant={modalState.variant}
					loading={modalState.loading}
					onConfirm={handleConfirm}
					onCancel={closeModal}
				/>
			</div>
		</div>
	)
}
