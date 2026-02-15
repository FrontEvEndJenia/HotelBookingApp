import { forwardRef } from 'react'

export const FormInput = forwardRef(
	(
		{
			label,
			type = 'text',
			value,
			onChange,
			placeholder = '',
			error = '',
			className = '',
			disabled = false,
			required = false,
			icon: Icon,
			...props
		},
		ref,
	) => {
		return (
			<div className={`mb-4 ${className}`}>
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
				)}

				<div className="relative">
					{Icon && (
						<Icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
					)}
					<input
						ref={ref}
						type={type}
						value={value}
						onChange={onChange}
						placeholder={placeholder}
						disabled={disabled}
						className={`
            w-full px-4 py-3 rounded-lg border
            ${Icon ? 'pl-11' : 'pl-4'}
            ${
				error
					? 'border-red-300 focus:ring-red-500 focus:border-red-500'
					: 'border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55]'
			}
            bg-white text-gray-900 placeholder-gray-500 focus:outline-none transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
						{...props}
					/>
				</div>

				{error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
			</div>
		)
	},
)

FormInput.displayName = 'FormInput'
