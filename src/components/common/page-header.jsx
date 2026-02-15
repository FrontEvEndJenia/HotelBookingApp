import { BackButton } from './back-button'

export const PageHeader = ({
	title,
	subtitle,
	actions,
	showBackButton = false,
	backButtonLabel = 'Назад',
	className = '',
}) => {
	return (
		<div className={`mb-8 ${className}`}>
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					{showBackButton && <BackButton label={backButtonLabel} />}
					<div>
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
							{title}
						</h1>
						{subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
					</div>
				</div>

				{actions && <div className="flex items-center gap-3">{actions}</div>}
			</div>
		</div>
	)
}

export const SectionHeader = ({ title, subtitle, actions, className = '' }) => (
	<div className={`mb-6 ${className}`}>
		<div className="flex items-center justify-between gap-4">
			<div>
				<h2 className="text-xl font-bold text-gray-900">{title}</h2>
				{subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
			</div>
			{actions && <div className="flex items-center gap-3">{actions}</div>}
		</div>
	</div>
)
