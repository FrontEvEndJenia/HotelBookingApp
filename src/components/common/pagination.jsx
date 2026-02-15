import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({
	currentPage,
	lastPage,
	totalItems,
	onPageChange,
	itemsPerPage = 12,
	className = '',
}) => {
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= lastPage) {
			onPageChange(newPage)
		}
	}

	const getPageNumbers = () => {
		const pages = []
		const maxVisible = 5

		if (lastPage <= maxVisible) {
			for (let i = 1; i <= lastPage; i++) {
				pages.push(i)
			}
		} else if (currentPage <= 3) {
			for (let i = 1; i <= maxVisible; i++) {
				pages.push(i)
			}
		} else if (currentPage >= lastPage - 2) {
			for (let i = lastPage - 4; i <= lastPage; i++) {
				pages.push(i)
			}
		} else {
			for (let i = currentPage - 2; i <= currentPage + 2; i++) {
				pages.push(i)
			}
		}

		return pages
	}

	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	return (
		<div className={`flex items-center justify-between gap-4 ${className}`}>
			<div className="text-sm text-gray-600">
				Показано {startItem}-{endItem} из {totalItems}
			</div>

			{lastPage > 1 && (
				<div className="flex items-center space-x-2">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
					>
						<ChevronLeft size={16} />
						Назад
					</button>

					<div className="flex items-center space-x-1">
						{getPageNumbers().map((pageNum) => (
							<button
								key={pageNum}
								onClick={() => handlePageChange(pageNum)}
								className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
									currentPage === pageNum
										? 'bg-[#6F7B55] text-white'
										: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
								}`}
							>
								{pageNum}
							</button>
						))}

						{lastPage > 5 && currentPage < lastPage - 2 && (
							<>
								<span className="text-gray-500 px-1">...</span>
								<button
									onClick={() => handlePageChange(lastPage)}
									className="w-8 h-8 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center text-sm"
								>
									{lastPage}
								</button>
							</>
						)}
					</div>

					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === lastPage}
						className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
					>
						Вперед
						<ChevronRight size={16} />
					</button>
				</div>
			)}
		</div>
	)
}
