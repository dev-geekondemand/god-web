"use client";
import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustonInput';
import Image from 'next/image';
import { useAppDispatch } from '@/lib/hooks';
import { searchGeeks } from '@/features/geek/geekSlice';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { getCategories } from '@/features/category/categorySlice';
import CustomSelect from '../components/CustomSelect';
import Geek from '@/interfaces/Geek';
import Pagination from '../components/Pagination';
import { Category } from '@/interfaces/Category';
import toast from 'react-hot-toast';
import CustomToast from '../components/CustomToast';
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
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const isAuthenticated = useSelector((state: RootState) => state.seeker.isAuthenticated);
  const isGeekAuthenticated = useSelector((state: RootState) => state.geek.isAuthenticated);

  const router = useRouter();

  

  const handleClick=(geekId:string)=>{
    if(isAuthenticated || isGeekAuthenticated ){
      const query = selectedCategory?._id ? `?categoryId=${selectedCategory._id}` : '';
      router.push(`/geeks/${geekId}${query}`, {});
    }else{
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
    });
    setSelectedCategory(null);
    setSelectedBrand(null);
  };



  

  return (


    <section className='w-full flex flex-col items-center justify-center'>
      
      <PageBanner title="Geeks" crumbs={[{ label: 'Geeks' }]} />

      <div className="grid w-full py-20 grid-cols-12 gap-4 relative max-w-7xl mx-auto">
        {/* Filters */}
        <div className="lg:col-span-3 col-span-12 lg:sticky lg:top-20 p-2 self-start">
          <div className='bg-white shadow rounded-lg p-4 gap-5 flex flex-col divide-y'>
            <h3 className="text-xl font-bold pb-2">Filters</h3>

            <div className='flex flex-col gap-3 pb-4'>
              <p className="text-sm">Search by Skill</p>
               <CustomSelect
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onChange={handleChange}
                />
            </div>

            <div className='flex flex-col gap-3 pb-4'>
              <p className="text-sm">Search by Brand</p>
                <div className="relative w-full mx-auto">
                      {/* Custom Select Button */}
                      <div
                        onClick={toggleDropdown}
                        className="bg-white border text-sm text-gray-700 border-gray-300 rounded-md px-4 py-2 cursor-pointer"
                      >
                        {selectedBrand?.name || 'Select Brand'}
                      </div>

                      {/* Dropdown Options (Always open upwards) */}
                      <div
                        className={`absolute z-50 left-0 custom-scrollbar right-0 bg-white border border-b-0 border-gray-800 rounded-sm -scroll-m-8 mt-1 max-h-48 overflow-y-scroll ${isOpen ? 'block' : 'hidden'} bottom-full`}
                      >
                        {brands?.map((b, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setFilters({ ...filters, brandId: b._id });
                              setSelectedBrand(b);
                              setIsOpen(false);
                            }}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-500"
                          >
                            {b?.name}
                          </div>
                        ))}
                      </div>
                    </div>
            </div>

            <div className='flex flex-col gap-3 pb-4'>
              <p className="text-sm">City</p>
              <CustomInput
                placeholder="City"
                title=""
                required={false}
                type='text'
                name='city'
                value={filters.city}
                onChange={handleInputChange}
                labelFor='city'
                labelBg=""
                disabled={false}
                readOnly={false}
              />
            </div>

            <div className='flex flex-col gap-3 pb-4'>
              <p className="text-sm">State</p>
              <CustomInput
                placeholder="State"
                title=""
                required={false}
                type='text'
                name='state'
                value={filters.state}
                onChange={handleInputChange}
                labelFor='state'
                labelBg=""
                disabled={false}
                readOnly={false}
              />
            </div>

            <button
              onClick={handleSubmit}
              className='bg-gray-800 text-white hover:bg-black transition w-full py-2 rounded-md mt-4'
            >
              Apply Filters
            </button>
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
