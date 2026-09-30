import {GeekData} from '@/interfaces/Geek';

const PLAN_CONFIG: Record<string, { label: string; color: string }> = {
	Professional: { label: 'Professional', color: 'text-amber-700 border-amber-200 bg-amber-50' },
	Advance:      { label: 'Advance',      color: 'text-teal-700 border-teal-200 bg-teal-50' },
};

interface GeekCardProps {
	geekData: GeekData;
	handleGeekCardClick: () => void;
	isSubmitting?: boolean;
}

const GeekCard: React.FC<GeekCardProps> = ({ geekData, handleGeekCardClick, isSubmitting = false }) => {
	const plan = PLAN_CONFIG[geekData.subscriptionPlan] ?? null;
	const isCorporate = !!(geekData.__t === 'Corporate' || geekData.companyName);

	return (
		// Width is owned by the grid that lays these out. The old fixed
		// `min-w-[220px]` forced two 220px columns into a ~360px phone panel,
		// which is what made the cards overlap and the row scroll sideways.
		<div className='w-full h-full min-w-0 flex flex-col justify-between shadow-lg border border-teal-500 p-3 sm:p-4 rounded-2xl'>

			<div className='flex flex-col gap-1 min-w-0'>
				<div className='mb-2 flex flex-col items-center gap-1.5 min-w-0'>
					<div className='font-semibold text-sm sm:text-base md:text-lg text-center break-words w-full'>
						{geekData.fullName.first} {geekData.fullName.last}
						{geekData?.address?.city && `, ${geekData?.address?.state}`}
					</div>
					{(isCorporate || plan) && (
						<div className='flex flex-wrap justify-center gap-1'>
							{isCorporate && (
								<span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-0.5'>
									<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H3m8-10h.01M12 17h.01M9 17h.01" />
									</svg>
									Corporate
								</span>
							)}
							{plan && (
								<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${plan.color}`}>
									{plan.label}
								</span>
							)}
						</div>
					)}
				</div>
				<div className='md:text-sm text-xs text-gray-600 break-words'>
					<span className='font-bold md:text-sm text-xs'>Primary Skill:</span> {geekData.primarySkillName}
				</div>
				{geekData?.secondarySkillsNames && geekData.secondarySkillsNames.length > 0 && (
					<div className='md:text-sm text-xs flex flex-wrap gap-x-1 text-gray-600 break-words'>
						<span className='font-bold'>Secondary Skills:</span>{' '}
						{geekData?.secondarySkillsNames?.map((skill,i:number) => (
							i<2 &&<div key={i}>{skill}</div>
						))}
					</div>
				)}
				<div color='gray' className='md:text-sm text-xs flex items-center gap-1 text-gray-600'>
					<span className='font-bold'>Experience:</span> {geekData.yoe} years
				</div>
			</div>
			<div className='pt-3 flex flex-wrap gap-4'>
				<button
					onClick={handleGeekCardClick}
					disabled={isSubmitting}
					className='bg-teal-500 text-white py-1.5 text-xs px-4 rounded-md w-full sm:w-auto hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed'>
					{isSubmitting ? 'Sending…' : 'Book Now'}
				</button>
			</div>
		</div>
	);
};
export default GeekCard;
