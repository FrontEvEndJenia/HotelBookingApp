import { Calendar as CalendarIcon } from 'lucide-react'

export const DatePicker = ({ label, value, onChange, minDate, required, disabled }) => {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<div className="relative">
				<CalendarIcon className="absolute left-3 top-3 text-gray-400" size={20} />
				<input
					type="date"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
					min={minDate}
					required={required}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}
