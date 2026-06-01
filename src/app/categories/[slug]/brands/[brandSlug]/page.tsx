"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/lib/hooks';
import { searchGeeks } from '@/features/geek/geekSlice';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import Geek from '@/interfaces/Geek';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/app/components/Pagination';
import GeekSkeletonCard from '@/app/components/GeekSkeletenCard';
import { fetchUserLocation } from '@/features/locationSlice';
import Link from 'next/link';
import PageBanner from '@/app/components/PageBanner';
import { getCategories } from '@/features/category/categorySlice';
import { getBrandsByCategory } from '@/features/brands/brandsSlice';
import { Category } from '@/interfaces/Category';
import Brand from '@/interfaces/Brand';

interface GeekState {
  geeks: Geek[];
  total: number;
  pages: number;
  page: number;
}

interface BrandsByCategory {
  category: { id: string; name: string };
  brands: Brand[];
}

const LIMIT = 12;

const IS_OBJECT_ID = /^[0-9a-fA-F]{24}$/;

const PLAN_CONFIG: Record<string, { label: string; color: string }> = {
  Professional: { label: 'Professional', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  Advance:      { label: 'Advance',      color: 'text-teal-700 border-teal-200 bg-teal-50' },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const GeeksByCategories = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { slug, brandSlug } = useParams() as { slug: string; brandSlug: string };
  const router = useRouter();

  // ── Redux state ──────────────────────────────────────────────────────────
  const categories = useSelector((state: RootState) => state.category?.categories) as Category[];
  const catLoading  = useSelector((state: RootState) => state.category?.isPending);
  const brandState  = useSelector((state: RootState) => state.brand?.brandsByCategory as BrandsByCategory);
  const brandsLoading = useSelector((state: RootState) => state.brand?.isLoading);

  const curCity = useSelector((state: RootState) => state.location.city);
  const userLat  = useSelector((state: RootState) => state.location.lat);
  const userLng  = useSelector((state: RootState) => state.location.lng);

  const geekState = useSelector((state: RootState) => state.geek?.geeks) as unknown as GeekState;
  const geeksLoading = useSelector((state: RootState) => state.geek?.isLoading);
  // ── Resolved IDs (slug → _id) ────────────────────────────────────────────
  const [resolvedCategoryId, setResolvedCategoryId] = useState<string | null>(null);
  const [resolvedBrandId,    setResolvedBrandId]    = useState<string | null>(null);

  // ── Page / filter state ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(() => {
    const p = searchParams.get('page');
    return p ? parseInt(p, 10) : 1;
  });

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    state: '',
    brandId: '',
    name: '',
    area: '',
    availableDay: '',
    availableFrom: '',
    availableTo: '',
  });

  // ── Resolution steps ─────────────────────────────────────────────────────

  // 1. Ensure categories are in the store
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  // 2. Resolve category slug → _id
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    if (IS_OBJECT_ID.test(slug)) {
      setResolvedCategoryId(slug);
    } else {
      const match = categories.find((c) => c.slug === slug);
      if (match) setResolvedCategoryId(match._id);
    }
  }, [categories, slug]);

  // 3a. If brandSlug is already an ObjectID, resolve immediately
  useEffect(() => {
    if (IS_OBJECT_ID.test(brandSlug)) {
      setResolvedBrandId(brandSlug);
    }
  }, [brandSlug]);

  // 3b. Otherwise fetch brands for the category, then find brand by slug
  useEffect(() => {
    if (!resolvedCategoryId || IS_OBJECT_ID.test(brandSlug)) return;
    dispatch(getBrandsByCategory(resolvedCategoryId));
  }, [dispatch, resolvedCategoryId, brandSlug]);

  // 4. Find brand _id from the loaded brands list
  useEffect(() => {
    if (IS_OBJECT_ID.test(brandSlug)) return; // already resolved in 3a
    const brands = brandState?.brands as Brand[];
    if (!brands || brands.length === 0) return;
    const match = brands.find((b) => b.slug === brandSlug);
    if (match) setResolvedBrandId(match._id);
  }, [brandState, brandSlug]);

  // 5. Push resolved brandId into filters
  useEffect(() => {
    if (resolvedBrandId) {
      setFilters((prev) => ({ ...prev, brandId: resolvedBrandId }));
    }
  }, [resolvedBrandId]);

  // ── Location ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (curCity) setFilters((prev) => ({ ...prev, city: curCity }));
  }, [curCity]);

  useEffect(() => {
    if (!curCity) dispatch(fetchUserLocation());
  }, [curCity, dispatch]);

  // ── Geek search — fires only after both IDs are resolved ─────────────────
  useEffect(() => {
    if (!resolvedCategoryId || !filters.brandId) return;
    dispatch(searchGeeks({
      skill: resolvedCategoryId,
      ...filters,
      lat: userLat != null ? String(userLat) : '',
      lng: userLng != null ? String(userLng) : '',
      page,
      limit: LIMIT,
    }));
  }, [dispatch, filters, resolvedCategoryId, page, userLat, userLng]);

  useEffect(() => {
    if (geekState?.geeks) {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [geekState]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setPage(1);
    setLoading(true);
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', '1');
    router.replace(`?${p.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', String(newPage));
    router.replace(`?${p.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setFilters({
      city: curCity || '',
      state: '',
      brandId: resolvedBrandId || '',
      name: '',
      area: '',
      availableDay: '',
      availableFrom: '',
      availableTo: '',
    });
  };

  const handleClick = (geekId: string) => {
    router.push(`/geeks/${geekId}?categoryId=${resolvedCategoryId}`);
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const isResolvingIds = !resolvedCategoryId || !filters.brandId;
  const isResolvingData = catLoading || brandsLoading;
  const showSkeleton = loading || geeksLoading || isResolvingIds || isResolvingData;

  const totalPages = geekState?.pages;
  const geeks = geekState?.geeks as Geek[];
  const activeFilterCount = [filters.name, filters.area, filters.state, filters.availableDay].filter(Boolean).length;

  return (
    <section className='w-full flex flex-col items-center justify-center'>
      <PageBanner title="Geeks" crumbs={[{ label: 'Geeks' }]} />

      <div className="w-full max-w-7xl mx-auto px-4 py-10 flex flex-col gap-6">

        {/* ── Compact filter bar ──────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-wrap gap-2 items-center">

          <input
            name='city'
            value={filters.city}
            onChange={handleInputChange}
            placeholder="City"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 w-32"
          />

          <input
            name='state'
            value={filters.state}
            onChange={handleInputChange}
            placeholder="State"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 w-32"
          />

          <input
            name='name'
            value={filters.name}
            onChange={handleInputChange}
            placeholder="Geek name"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 w-36"
          />

          <input
            name='area'
            value={filters.area}
            onChange={handleInputChange}
            placeholder="Area / locality"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 w-36"
          />

          <select
            name='availableDay'
            value={filters.availableDay}
            onChange={handleInputChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">Any day</option>
            {DAYS.map(d => <option key={d} value={d}>{d.slice(0, 3)}</option>)}
          </select>

          {filters.availableDay && (
            <>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">From</span>
                <input
                  type='time'
                  name='availableFrom'
                  value={filters.availableFrom}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">To</span>
                <input
                  type='time'
                  name='availableTo'
                  value={filters.availableTo}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 ml-auto">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="bg-gray-800 text-white text-sm hover:bg-black transition px-4 py-2 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        {/* Result count */}
        {geekState?.total > 0 && (
          <p className="text-sm text-gray-500">
            Found <span className="font-semibold text-teal-600">{geekState.total}</span> geek{geekState.total !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {showSkeleton
            ? Array.from({ length: LIMIT }).map((_, i) => <GeekSkeletonCard key={i} />)
            : geeks?.length > 0
              ? geeks.map((geek, index) => {
                  const plan = PLAN_CONFIG[geek.subscriptionPlan] ?? null;
                  const isCorporate = !!(geek.__t === 'Corporate' || geek.companyName);
                  return (
                    <button
                      onClick={() => handleClick(geek._id)}
                      key={index}
                      className='flex flex-col items-center bg-white gap-3 shadow-sm border border-gray-100 hover:shadow-md transition rounded-xl p-4'
                    >
                      <div className='relative w-full aspect-[4/3] overflow-hidden rounded-md'>
                        <Image
                          src={geek.profileImage?.url || '/assets/images/placeholder_user.jpg'}
                          alt={geek.fullName?.first || 'Geek'}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className='object-cover'
                          priority={index === 0}
                        />
                        {(isCorporate || plan) && (
                          <div className='absolute top-2 left-2 flex flex-wrap gap-1'>
                            {isCorporate && (
                              <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow inline-flex items-center gap-0.5'>
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H3m8-10h.01M12 17h.01M9 17h.01" />
                                </svg>
                                Corporate
                              </span>
                            )}
                            {plan && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow ${plan.label === 'Professional' ? 'bg-amber-500 text-white' : 'bg-teal-500 text-white'}`}>
                                {plan.label}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className='w-full flex flex-col gap-1 text-left'>
                        <p className="text-sm font-semibold text-gray-800">{geek.fullName?.first} {geek.fullName?.last}</p>
                        <p className='text-xs text-gray-500'>{geek.primarySkill?.title || 'Skill not available'}</p>
                      </div>
                    </button>
                  );
                })
              : (
                <div className='col-span-full flex flex-col items-center justify-center py-16 text-center'>
                  <Image src="/assets/images/coming-soon.jpg" alt="No Geeks Found" width={300} height={300} className="mb-4 opacity-80" />
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">No geeks found for your filters.</h2>
                  <div className='flex gap-3'>
                    <button onClick={resetFilters} className='bg-teal-600 text-white rounded-lg px-5 py-2 text-sm hover:bg-teal-700'>Clear Filters</button>
                    <Link href='/geeks' className='bg-gray-100 text-gray-700 rounded-lg px-5 py-2 text-sm hover:bg-gray-200'>All Geeks</Link>
                  </div>
                </div>
              )}
        </div>

        {geeks?.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </section>
  );
};

export default GeeksByCategories;
