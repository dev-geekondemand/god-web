// Placeholder for the Geek grid while the list is being fetched. The shape
// deliberately mirrors GeekCard (centred name, badge, three detail lines, a
// button) so the real cards drop in without the layout jumping.
const GeekCardSkeleton = () => (
	<div className='w-full h-full min-w-0 flex flex-col justify-between shadow-lg border border-teal-100 p-3 sm:p-4 rounded-2xl animate-pulse'>
		<div className='flex flex-col gap-2 min-w-0'>
			<div className='mb-1 flex flex-col items-center gap-1.5'>
				<div className='h-4 w-3/4 rounded bg-gray-200' />
				<div className='h-3 w-16 rounded-full bg-gray-200' />
			</div>
			<div className='h-3 w-5/6 rounded bg-gray-200' />
			<div className='h-3 w-2/3 rounded bg-gray-200' />
			<div className='h-3 w-1/2 rounded bg-gray-200' />
		</div>
		<div className='pt-3'>
			<div className='h-7 w-full sm:w-24 rounded-md bg-gray-200' />
		</div>
	</div>
);

interface GeekListSkeletonProps {
	/** How many placeholders to draw — pass the previous page's count to keep the height steady. */
	count?: number;
	label?: string;
}

const GeekListSkeleton: React.FC<GeekListSkeletonProps> = ({
	count = 4,
	label = 'Finding the right Geeks for you…',
}) => (
	<div className='flex flex-col gap-3 w-full min-w-0' role='status' aria-live='polite'>
		<div className='flex items-center justify-center gap-2'>
			<span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent' />
			<p className='text-xs md:text-sm text-gray-500'>{label}</p>
		</div>
		<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0 px-1'>
			{Array.from({ length: Math.max(1, Math.min(count, 6)) }).map((_, index) => (
				<GeekCardSkeleton key={index} />
			))}
		</div>
	</div>
);

export default GeekListSkeleton;
