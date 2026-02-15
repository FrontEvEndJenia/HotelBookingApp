import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useAuth } from '../../hooks'
import { FormInput } from '../../components/common/form-input'
import { FormButton } from '../../components/common/form-button'
import { ErrorMessage } from '../../components/common/error-message'

const loginSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните поле Login')
		.matches(/^\w+$/, 'Допускаются только буквы и цифры')
		.min(4, 'Логин должен содержать минимум 4 символов')
		.max(12, 'Логин должен содержать максимум 12 символов'),
	password: yup
		.string()
		.required('Заполните поле Password')
		.matches(/^[\w#%]+$/, 'Допускаются только буквы, цифры и знаки # %')
		.min(5, 'Пароль должен содержать минимум 5 символов')
		.max(20, 'Пароль должен содержать максимум 20 символов'),
})

export default function SignInPage() {
	const [showPassword, setShowPassword] = useState(false)
	const { loginWithRedirect, loading, error, clearError } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(loginSchema),
	})

	const onSubmit = async (data) => {
		clearError()
		await loginWithRedirect(data.login, data.password, '/')
	}

	return (
		<div className="min-h-screen bg-white font-inter flex items-center justify-center p-4">
			<div className="absolute inset-0 z-0">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage:
							'url(https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)',
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-[#6F7B55]/40 via-transparent to-transparent"></div>
				<div className="absolute inset-0 bg-[#93A06C]/30"></div>
				<div className="absolute inset-0 bg-black/20"></div>
			</div>

			<div className="relative z-10 w-full max-w-md">
				<div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
					<div className="bg-gradient-to-r from-[#6F7B55] to-[#93A06C] p-6 text-center">
						<h1 className="text-white font-bold text-3xl mb-2 tracking-wide drop-shadow-lg">
							Grand Palace Hotel
						</h1>
						<p className="text-white/90 text-sm font-light">Вход в аккаунт</p>
					</div>

					<div className="p-6">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							<FormInput
								label="Логин"
								type="text"
								placeholder="Введите логин"
								error={errors.login?.message}
								icon={User}
								{...register('login')}
							/>

							<div>
								<FormInput
									label="Пароль"
									type={showPassword ? 'text' : 'password'}
									placeholder="Введите пароль"
									error={errors.password?.message}
									icon={Lock}
									{...register('password')}
								/>
								<div className="mt-2 text-xs text-gray-500">
									Допустимые символы: буквы, цифры, знаки # и %
								</div>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="mt-2 text-gray-400 hover:text-gray-600 text-sm"
								>
									{showPassword ? (
										<>
											<EyeOff size={16} className="inline mr-1" />{' '}
											Скрыть пароль
										</>
									) : (
										<>
											<Eye size={16} className="inline mr-1" />{' '}
											Показать пароль
										</>
									)}
								</button>
							</div>

							{error && <ErrorMessage error={error} />}

							<FormButton type="submit" loading={loading} fullWidth>
								Войти
							</FormButton>

							<div className="text-center pt-4 border-t border-gray-200">
								<p className="text-gray-600 text-sm">
									Нет аккаунта?{' '}
									<Link
										to="/register"
										className="text-[#6F7B55] font-medium hover:underline"
									>
										Зарегистрироваться
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
