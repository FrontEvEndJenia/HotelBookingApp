export const AdminPageHeader = ({ title, subtitle, actions, className = '' }) => {
	return (
		<div className={`mb-8 ${className}`}>
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
						{title}
					</h1>
					{subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
				</div>

				{actions && <div className="flex items-center gap-3">{actions}</div>}
			</div>
		</div>
	)
}
