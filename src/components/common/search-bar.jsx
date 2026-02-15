import { Search } from 'lucide-react'
import { useState } from 'react'

export const SearchBar = ({
	value = '',
	placeholder = 'Поиск...',
	onSearch,
	className = '',
	showButton = true,
}) => {
	const [inputValue, setInputValue] = useState(value)

	const handleSearch = () => {
		onSearch(inputValue)
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	return (
		<div className={`relative ${className}`}>
			<Search
				className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
				size={20}
			/>
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyPress={handleKeyPress}
				placeholder={placeholder}
				className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#6F7B55] focus:border-[#6F7B55] outline-none"
			/>
			{showButton && (
				<button
					onClick={handleSearch}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6F7B55] text-white px-3 py-1 rounded-md text-sm hover:bg-[#5F6B45]"
				>
					Найти
				</button>
			)}
		</div>
	)
}
