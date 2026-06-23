"use client";
import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustonInput';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { searchGeeks } from '@/features/geek/geekSlice';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { getCategories } from '@/features/category/categorySlice';
import CustomSelect from '../components/CustomSelect';
import Geek from '@/interfaces/Geek';
import Pagination from '../components/Pagination';
import { Category } from '@/interfaces/Category';
import GeekSkeletonCard from '../components/GeekSkeletenCard';
import { fetchUserLocation } from '@/features/locationSlice';
import { getBrands, getBrandsByCategory } from '@/features/brands/brandsSlice';
import Brand from '@/interfaces/Brand';
import { useRouter, useSearchParams } from 'next/navigation';
import PageBanner from './PageBanner';
export interface GeekState {
  geeks: Geek[];
  total: number;
  pages: number;
  page: number;
}

const LIMIT = 12; // items per page

const PLAN_CONFIG: Record<string, { label: string; color: string }> = {
  Professional: { label: 'Professional', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  Advance:      { label: 'Advance',      color: 'text-teal-700 border-teal-200 bg-teal-50' },
};

const TIME_SLOTS = [
  { label: '6AM–12PM',  from: '06:00', to: '12:00' },
  { label: '12PM–5PM',  from: '12:00', to: '17:00' },
  { label: '5PM–9PM',   from: '17:00', to: '21:00' },
  { label: '9PM–12AM',  from: '21:00', to: '23:59' },
];

const Providers = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;


  const [page, setPage] = useState(pageFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<Category| null>(null);
  const [brands,setBrands] = useState<Brand[]>([]);  
    const [isOpen, setIsOpen] = useState(false); 
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

  
  const [filters, setFilters] = useState({
    skill: '',
    city: '',
    brandId: '',
    state: '',
    mode: '',
    chargeType: '',
    minRate: '',
    maxRate: '',
    lat: '',
    lng: '',
    name: '',
    area: '',
    availableDay: '',
    availableFrom: '',
    availableTo: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setPage(1); 
    router.push(`?page=1`, { scroll: false });
    setLoading(true);
    dispatch(searchGeeks({ ...filters, page: page, limit: LIMIT }));
  };



  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
    router.push(`?page=${newPage}`, { scroll: false });
    dispatch(searchGeeks({ ...filters, page: newPage, limit: LIMIT }));
  };

  const  geekState  = useSelector((state: RootState) => state.geek?.geeks) as unknown as GeekState;

  const geeks = geekState?.geeks as Geek[];

  const totalPages = geekState?.pages
  const router = useRouter();

  

  const handleClick=(geekId:string)=>{
    const query = selectedCategory?._id ? `?categoryId=${selectedCategory._id}` : '';
    router.push(`/geeks/${geekId}${query}`, {});
  };

  const curCity = useSelector((state: RootState) => state.location.city);
  const userLat = useSelector((state: RootState) => state.location.lat);
  const userLng = useSelector((state: RootState) => state.location.lng);

  useEffect(() => {
    const updates: Record<string, string> = {};
    if (curCity) updates.city = curCity;
    if (userLat != null) updates.lat = String(userLat);
    if (userLng != null) updates.lng = String(userLng);
    if (Object.keys(updates).length > 0) {
      setFilters(prev => ({ ...prev, ...updates }));
    }
  }, [curCity, userLat, userLng]);
  

  const categories = useSelector((state: RootState) => state.category.categories) as Category[];
  const allBrands = useSelector((state: RootState) => state.brand?.brands) as Brand[];
  const brandsByCategory = useSelector((state: RootState) => state.brand?.brandsByCategory?.brands) as Brand[];
  const isLoading = useSelector((state: RootState) => state.geek?.isLoading);
  
  useEffect(() => {
  if (geeks) {
    setLoading(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [geeks]);


  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
    dispatch(fetchUserLocation());
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchGeeks({ ...filters, page, limit: LIMIT }));
  }, [dispatch, filters, page]);

  const handleChange = (value: Category)=>{
    setFilters({ ...filters, skill: value?._id });
    setSelectedCategory(value);
    dispatch(getBrandsByCategory(value?._id || ''));
  }

  useEffect(()=>{
    if(selectedCategory !== null && selectedCategory !== undefined && brandsByCategory.length > 0){
      setBrands(brandsByCategory);
    }else{
      setBrands(allBrands);
    }
  },[selectedCategory ,brandsByCategory,allBrands])

  const resetFilters = () => {
    setFilters({
      skill: '',
      brandId: '',
      city: curCity || '',
      state: '',
      mode: '',
      chargeType: '',
      minRate: '',
      maxRate: '',
      lat: userLat != null ? String(userLat) : '',
      lng: userLng != null ? String(userLng) : '',
      name: '',
      area: '',
      availableDay: '',
      availableFrom: '',
      availableTo: '',
    });
    setSelectedCategory(null);
    setSelectedBrand(null);
  };



  

  return (


    <section className='w-full flex flex-col items-center justify-center'>
      
      <PageBanner title="Geeks" crumbs={[{ label: 'Geeks' }]} />

      <div className="grid w-full py-10 grid-cols-12 gap-4 relative max-w-7xl mx-auto px-4">
        {/* ── Filters sidebar ──────────────────────────────────────────── */}
        <div className="lg:col-span-3 col-span-12 lg:sticky lg:top-22 self-start">
          <div className='bg-white shadow-sm border border-gray-100 rounded-xl'>

            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
              <span className="text-sm font-semibold text-gray-800">Filters</span>
              <button
                onClick={resetFilters}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                Reset all
              </button>
            </div>

            <div className='flex flex-col gap-0 divide-y divide-gray-50'>

              {/* Skill */}
              <div className='px-4 py-3'>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Skill</p>
                <CustomSelect
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onChange={handleChange}
                />
              </div>

              {/* Brand */}
              <div className='px-4 py-3'>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Brand</p>
                <div className="relative w-full">
                  <div
                    onClick={toggleDropdown}
                    className="bg-white border border-gray-300 text-sm text-gray-700 rounded-md px-4 py-2 cursor-pointer"
                  >
                    {selectedBrand?.name || 'Any brand'}
                  </div>
                  {isOpen && (
                    <div className="absolute z-20 left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto custom-scrollbar shadow-sm">
                      <div
                        onClick={() => { setFilters(f => ({ ...f, brandId: '' })); setSelectedBrand(null); setIsOpen(false); }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-500 hover:text-white"
                      >
                        Any brand
                      </div>
                      {brands?.map((b, i) => (
                        <div
                          key={i}
                          onClick={() => { setFilters(f => ({ ...f, brandId: b._id })); setSelectedBrand(b); setIsOpen(false); }}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-500 hover:text-white"
                        >
                          {b?.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location — city + state in a 2-col grid */}
              <div className='px-4 py-3'>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Location</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name='city'
                    value={filters.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                  />
                  <input
                    name='state'
                    value={filters.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                  />
                </div>
              </div>

              {/* Name + Area — 2-col grid */}
              <div className='px-4 py-3'>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Search</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name='name'
                    value={filters.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                  />
                  <input
                    name='area'
                    value={filters.area}
                    onChange={handleInputChange}
                    placeholder="Area"
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className='px-4 py-3'>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Availability</p>
                <select
                  name='availableDay'
                  value={filters.availableDay}
                  onChange={handleInputChange}
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                >
                  <option value="">Any day</option>
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {filters.availableDay && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TIME_SLOTS.map(slot => {
                      const isActive = filters.availableFrom === slot.from && filters.availableTo === slot.to;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            availableFrom: isActive ? '' : slot.from,
                            availableTo:   isActive ? '' : slot.to,
                          }))}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                            isActive
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400 hover:text-teal-600'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Apply button */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className='bg-gray-900 text-white hover:bg-black transition w-full py-2.5 rounded-lg text-sm font-medium'
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Geeks List */}
        <div className="lg:col-span-9 col-span-12 p-2">
          <div className="bg-white p-4 mb-4 text-2xl font-bold">
            {geekState?.total > 0 && <h3 className='flex items-center gap-2'>Found <span className='text-teal-600'>{geekState?.total}</span> Geeks</h3>}
          </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {loading || isLoading
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <GeekSkeletonCard key={index} />
                    ))
                  : geeks?.length > 0
                    ? geeks.map((geek, index) => {
                        const plan = PLAN_CONFIG[geek.subscriptionPlan] ?? null;
                        const isCorporate = !!(geek.__t === 'Corporate' || geek.companyName);
                        return (
                          <button
                            onClick={() => handleClick(geek._id)}
                            key={index}
                            className='flex flex-col items-center bg-white gap-3 shadow rounded-lg p-4'
                          >
                            <div className='relative w-full aspect-[4/3] overflow-hidden rounded-md'>
                              <Image
                                src={geek.profileImage?.url || "/assets/images/placeholder_user.jpg"}
                                alt={geek.fullName?.first || "Geek"}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow ${
                                      plan.label === 'Professional' ? 'bg-amber-500 text-white' : 'bg-teal-500 text-white'
                                    }`}>
                                      {plan.label}
                                    </span>
                                  )}
                                </div>
                              )}
                              {geek.isAdhaarVerified && (
                                <div className='absolute top-2 right-2'>
                                  <span className='inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-600 text-white shadow'>
                                    <ShieldCheck className="w-2.5 h-2.5" /> ID Verified
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className='w-full flex flex-col gap-1'>
                              <p className="text-lg text-gray-800">
                                {geek.fullName?.first} {geek.fullName?.last}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {geek.primarySkill?.title || "Skill not available"}
                              </p>
                              {(geek.availability?.slots?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {geek.availability?.slots?.map(slot => (
                                    <span key={slot.day} className="text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded">
                                      {slot.day.slice(0, 3)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })
                    : (
                      <div className='w-full col-start-2 max-w-6xl mx-auto h-full flex flex-col items-center justify-center'>
                        <div className="flex flex-col items-center justify-center p-4 text-center w-full">
                          <Image
                           
                            src="/assets/images/coming-soon.jpg"
                            alt="No Geeks Found"
                            width={500}
                            height={500}
                            className="mb-4"
                          />

                          <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            We will be adding geeks very soon!
                          </h2>
                          <button onClick={resetFilters} className='bg-teal-600 text-white rounded-lg px-6 py-2.5 cursor-pointer hover:bg-teal-700'>Clear Filters</button>

                          
                        </div>
                      </div>
                    )}
              </div>


          
          {geeks?.length > 0 ? <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            /> : null}

        </div>
      </div>
    </section>
  );
};

export default Providers;
