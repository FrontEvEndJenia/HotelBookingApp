import { forwardRef } from 'react'

export const FormTextarea = forwardRef(
	(
		{
			label,
			value,
			onChange,
			placeholder = '',
			error = '',
			className = '',
			rows = 4,
			disabled = false,
			required = false,
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

				<textarea
					ref={ref}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					rows={rows}
					disabled={disabled}
					className={`
            w-full px-4 py-3 rounded-lg border
            ${
				error
					? 'border-red-300 focus:ring-red-500 focus:border-red-500'
					: 'border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55]'
			}
            bg-white text-gray-900 placeholder-gray-500 
            focus:outline-none transition-colors resize-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
					{...props}
				/>

				{error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
			</div>
		)
	},
)

FormTextarea.displayName = 'FormTextarea'
