"use client"

import GlobalSkeleton from '@/app/components/Sekeletn'
import { getBrandsByCategory } from '@/features/brands/brandsSlice'
import { getCategories } from '@/features/category/categorySlice'
import Brand from '@/interfaces/Brand'
import { Category } from '@/interfaces/Category'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PageBanner from '@/app/components/PageBanner'

interface BrandsByCategory {
    count: number;
    category: { id: string; name: string };
    brands: Brand[];
}

const IS_OBJECT_ID = /^[0-9a-fA-F]{24}$/;

const Brands = () => {
    const { slug } = useParams() as { slug: string };
    const dispatch = useAppDispatch();

    const categories = useSelector((state: RootState) => state.category?.categories) as Category[];
    const catLoading = useSelector((state: RootState) => state.category?.isPending);
    const brandState = useSelector((state: RootState) => state.brand?.brandsByCategory as BrandsByCategory);
    const brandsLoading = useSelector((state: RootState) => state.brand?.isLoading);

    const [resolvedCategoryId, setResolvedCategoryId] = useState<string | null>(null);

    // Step 1 — ensure categories are in the store
    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(getCategories());
        }
    }, [dispatch, categories]);

    // Step 2 — resolve slug → _id (raw ObjectID params still work for backward compat)
    useEffect(() => {
        if (!categories || categories.length === 0) return;
        if (IS_OBJECT_ID.test(slug)) {
            setResolvedCategoryId(slug);
        } else {
            const match = categories.find((c) => c.slug === slug);
            if (match) setResolvedCategoryId(match._id);
        }
    }, [categories, slug]);

    // Step 3 — fetch brands once we have the real _id
    useEffect(() => {
        if (resolvedCategoryId) {
            dispatch(getBrandsByCategory(resolvedCategoryId));
        }
    }, [dispatch, resolvedCategoryId]);

    const brands = brandState?.brands as Brand[];
    const category = brandState?.category;

    const isLoading = catLoading || brandsLoading || !resolvedCategoryId;

    return (
        <section className='w-full flex flex-col justify-center items-center'>
            <PageBanner title={category?.name || 'Brands'} crumbs={[{ label: category?.name || 'Brands' }]} />

            <div className='w-full flex justify-center items-center px-3 py-20'>
                <div className='w-full flex justify-center items-center max-w-7xl mx-auto'>
                    {isLoading
                        ? <GlobalSkeleton cards={15} cols={3} lgCols={5} />
                        : (
                            <div className='w-full grid md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 sm:grid-cols-3 grid-cols-2 gap-10 justify-center items-center'>
                                {brands?.length > 0 && brands.map((c) => (
                                    <Link
                                        href={`/categories/${slug}/brands/${c.slug || c._id}`}
                                        key={c._id}
                                        className='border border-gray-300 h-42 w-full bg-white group relative p-2 shadow-xs hover:border cursor-pointer rounded-lg flex'
                                    >
                                        <div className="flex flex-col rounded-t-md w-full h-full items-center justify-center">
                                            <div className='rounded-t-md relative w-full'>
                                                <Image
                                                    width={150}
                                                    height={100}
                                                    className='object-cover w-full rounded-t-md hover:scale-110 transition transform duration-500'
                                                    src={c.image?.url || "/assets/images/placeholder.webp"}
                                                    alt='Brand Image'
                                                />
                                            </div>
                                            <div className='w-full flex gap-2 justify-between items-center'>
                                                <div className='w-full flex items-center gap-4'>
                                                    <p className='text-base w-full text-center font-semibold text-gray-800'>
                                                        {c.name?.length > 20 ? `${c.name?.slice(0, 20)}...` : c.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
};

export default Brands;
