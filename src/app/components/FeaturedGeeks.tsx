"use client"
import React, { useEffect } from 'react'
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

    useEffect(() => {
        dispatch(searchGeeks({ page: 1, limit: 4 }));
    }, [dispatch]);

    const geeksHere = useSelector((state: RootState) => state.geek?.geeks) as unknown as GeeksHere;
    const geeks = geeksHere?.geeks;
    const isAuthenticated = useSelector((state: RootState) => state.seeker.isAuthenticated);
    const isLoading = useSelector((state: RootState) => state.geek.isLoading);

    const handleClick = (id: string) => {
        if (isAuthenticated) {
            window.location.href = `/geeks/${id}`;
        } else {
            toast.dismiss();
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    title="Not Logged in."
                    message="You are not logged in."
                    avatar="/assets/logo-big.webp"
                />
            ));
        }
    };


    return (
        <div className='max-w-7xl w-full mx-auto py-0'>
            <div className='flex w-full'>
                <div className='flex flex-col gap-5 w-full'>
                    <div className='py-5 flex flex-col gap-4'>
                        <h1 className='h2 text-center'>Top Geeks, <span className='text-teal-700'>Trusted by Many</span></h1>
                        <p className="body-2 text-gray-700 text-center max-w-2xl mx-auto">Meet our most sought-after IT experts, delivering reliable support every day.</p>
                    </div>

                    {isLoading || !geeks ? (
                        <GlobalSkeleton cards={4} cols={1} lgCols={4} />
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-200'>
                            {geeks?.map((geek) => {
                                const plan = planConfig[geek.subscriptionPlan] ?? null;
                                const isCorporate = !!(geek.__t === 'Corporate' || geek.companyName);
                                return (
                                    <button
                                        onClick={() => handleClick(geek._id)}
                                        className="border-r border-b border-gray-200 bg-white group relative justify-center cursor-pointer flex flex-col items-start"
                                        key={geek._id}
                                    >
                                        <div className="flex w-full items-center justify-start sm:px-5 py-3">
                                            <div className='w-[80px] h-[80px] overflow-hidden rounded-full relative shrink-0'>
                                                <Image
                                                    fill
                                                   
                                                    className='object-cover w-full rounded-t-md hover:scale-110 transition transform duration-500'
                                                    src={geek.profileImage?.url ? geek.profileImage.url : "/assets/images/placeholder_user.jpg"}
                                                    alt='Geek profile'
                                                    sizes="80px"
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1.5 items-start justify-start p-3 min-w-0'>
                                                {/* Name */}
                                                <p className='text-base font-bold text-gray-800 leading-tight'>
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
                                                        <span>{geek.address.city}, {geek.address.state}</span>
                                                    )}
                                                    {geek.yoe > 0 && (
                                                        <span>{geek.yoe} yr{geek.yoe !== 1 ? 's' : ''} exp</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className='w-full flex justify-center'>
                        <Link
                            href='/geeks'
                            className="mt-4 flex items-center cursor-pointer gap-1 w-fit px-6 py-2 bg-gray-900 text-sm text-white rounded-md"
                        >
                            View All
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
