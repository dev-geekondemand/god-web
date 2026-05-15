import {GeekData} from '@/interfaces/Geek';

const PLAN_CONFIG: Record<string, { label: string; color: string }> = {
	Professional: { label: 'Professional', color: 'text-amber-700 border-amber-200 bg-amber-50' },
	Advance:      { label: 'Advance',      color: 'text-teal-700 border-teal-200 bg-teal-50' },
};

interface GeekCardProps {
	geekData: GeekData;
	handleGeekCardClick: () => void;
}

const GeekCard: React.FC<GeekCardProps> = ({ geekData, handleGeekCardClick }) => {
	const plan = PLAN_CONFIG[geekData.subscriptionPlan] ?? null;
	const isCorporate = !!(geekData.__t === 'Corporate' || geekData.companyName);

	return (
		<div className='max-w-2xs min-w-[220px] h-fit shadow-lg border border-teal-500 p-4 m-2 text-wrap rounded-2xl'>

			<div className='flex flex-col gap-1'>
				<div className='mb-2 flex flex-col items-center gap-1.5'>
					<div className='font-semibold md:text-xl text-base text-center'>
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
				<div className='md:text-sm text-xs text-gray-600'>
					<span className='font-bold md:text-sm text-xs'>Primary Skill:</span> {geekData.primarySkillName}
				</div>
				{geekData.secondarySkillsNames.length > 0 && (
					<div className='md:text-sm text-xs flex flex-wrap  text-gray-600'>
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
			<div className='py-2 bottom-0 flex flex-wrap gap-4'>
				<button
					onClick={handleGeekCardClick}
					className='bg-teal-500 text-white py-1.5 text-xs px-4 rounded-md'>
					Book Now
				</button>
			</div>
		</div>
	);
};
export default GeekCard;
