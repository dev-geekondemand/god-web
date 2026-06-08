"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch } from '@/lib/hooks';
import { searchGeeks } from '@/features/geek/geekSlice';
import { useSelector } from 'react-redux';
import Geek from '@/interfaces/Geek';
import { RootState } from '@/lib/store';
import toast from 'react-hot-toast';
import CustomToast from './CustomToast';
import GlobalSkeleton from './Sekeletn';

interface GeeksHere {
    geeks: Geek[]
    total: number
    pages: number
    page: number
}

const planConfig: Record<string, { label: string; color: string }> = {
    Professional: { label: 'Professional', color: 'text-amber-700 border-amber-200 bg-amber-50' },
    Advance:      { label: 'Advance',      color: 'text-teal-700 border-teal-200 bg-teal-50' },
};

const FeaturedGeeks = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(searchGeeks({ page: 1, limit: 4 }));
    }, [dispatch]);

    const geeksHere = useSelector((state: RootState) => state.geek?.geeks) as unknown as GeeksHere;
    const geeks = geeksHere?.geeks;
    const isAuthenticated = useSelector((state: RootState) => state.seeker.isAuthenticated);
    const isLoading = useSelector((state: RootState) => state.geek.isLoading);

    const handleClick = (id: string) => {
        // if (isAuthenticated) {
            router.push(`/geeks/${id}`);
        // } else {
        //     toast.dismiss();
        //     toast.custom((t) => (
        //         <CustomToast
        //             t={t}
        //             title="Not Logged in."
        //             message="You are not logged in."
        //             avatar="/assets/logo-big.webp"
        //         />
        //     ));
        // }
    };


    return (
        <div className='max-w-7xl w-full mx-auto py-0'>
            <div className='flex w-full'>
                <div className='flex flex-col gap-5 w-full'>
                    <div className='py-3 sm:py-5 flex flex-col items-center gap-2 sm:gap-3'>
                        <span className='text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-teal-600'>Expert Network</span>
                        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-center'>Meet Our <span className='text-teal-700'>Top-Rated IT Support Experts</span></h2>
                        <div className='w-8 sm:w-10 h-0.5 bg-teal-500 rounded-full' />
                        <p className="text-xs sm:text-sm text-gray-700 text-center max-w-2xl mx-auto">Verified, background-checked IT professionals ready to help at your home or office.</p>
                    </div>

                    {isLoading || !geeks ? (
                        <GlobalSkeleton cards={4} cols={1} lgCols={4} />
                    ) : (
                        <div className='flex overflow-x-auto hide-scrollbar snap-x snap-mandatory border-t border-l border-gray-200 mmd:grid mmd:grid-cols-2 lg:grid-cols-4'>
                            {geeks?.map((geek) => {
                                const plan = planConfig[geek.subscriptionPlan] ?? null;
                                const isCorporate = !!(geek.__t === 'Corporate' || geek.companyName);
                                return (
                                    <button
                                        onClick={() => handleClick(geek._id)}
                                        className="shrink-0 xxs:w-[88vw] xs:w-[78vw] sm:w-[56vw] md:w-[46vw] mmd:w-auto lg:w-auto snap-start border-r border-b border-gray-200 bg-white group relative cursor-pointer flex flex-col items-start transition-colors duration-200 hover:bg-teal-50/40"
                                        key={geek._id}
                                    >
                                        {/* Sliding teal accent bar on hover */}
                                        <span className="absolute top-0 left-0 w-full h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                                        <div className="flex w-full items-center justify-start px-3 sm:px-4 md:px-5 py-3 sm:py-4">
                                            <div className='w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] overflow-hidden rounded-full relative shrink-0 ring-2 ring-gray-100 group-hover:ring-teal-200 transition-all duration-200'>
                                                <Image
                                                    fill
                                                    className='object-cover w-full group-hover:scale-110 transition-transform duration-500'
                                                    src={geek.profileImage?.url ? geek.profileImage.url : "/assets/images/placeholder_user.jpg"}
                                                    alt='Geek profile'
                                                    sizes="80px"
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1 sm:gap-1.5 items-start justify-start p-2 sm:p-3 min-w-0 flex-1'>
                                                {/* Name */}
                                                <p className='text-sm sm:text-base text-start font-bold text-gray-800 leading-tight'>
                                                    {geek.fullName?.first} {geek.fullName?.last}
                                                </p>

                                                {/* Badges row */}
                                                <div className='flex flex-wrap gap-1'>
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
                                                    {geek.isAdhaarVerified && (
                                                        <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200'>
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Primary skill */}
                                                <p className='block text-start text-gray-700 text-xs font-medium truncate max-w-full'>
                                                    {geek?.primarySkill?.title}
                                                </p>

                                                {/* Location + YOE */}
                                                <div className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500'>
                                                    {geek.address?.city && (
                                                        <span className='flex items-center gap-0.5'>
                                                            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {geek.address.city}, {geek.address.state}
                                                        </span>
                                                    )}
                                                    {geek.yoe > 0 && (
                                                        <span>{geek.yoe} yr{geek.yoe !== 1 ? 's' : ''} exp</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Chevron — fades in on hover */}
                                            <svg className="w-4 h-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className='w-full flex justify-center'>
                        <Link
                            href='/geeks'
                            className="mt-3 sm:mt-4 flex items-center cursor-pointer gap-2 w-fit px-4 py-2 sm:px-6 sm:py-2.5 bg-gray-900 hover:bg-teal-700 transition-colors duration-200 text-xs sm:text-sm font-medium text-white rounded-md"
                        >
                            View All Geeks
                            <svg height="12" strokeLinejoin="round" viewBox="0 0 16 16" width="12">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedGeeks;
