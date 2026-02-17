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
export interface GeekState {
  geeks: Geek[];
  total: number;
  pages: number;
  page: number;
}

const LIMIT = 12; // items per page

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
      router.push(`/geeks/${geekId}?categoryId=${selectedCategory?._id}`,{});
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

  useEffect(() => {
    if (curCity) {
      setFilters({ ...filters, city: curCity });
    }
  }, [curCity]);
  

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
      city: '',
      state: '',
      mode: '',
      chargeType: '',
      minRate: '',
      maxRate: '',
    });
    setSelectedCategory(null);
    setSelectedBrand(null);
  };


const azureLoader = ({ src }:{src:string}) => src;

  

  return (


    <section className='w-full flex flex-col items-center justify-center'>
      
      <div className='w-full relative breadcrumb-bg-2'>
        <div className='w-full breadcrumb-bg py-10 text-center bg-[#fbfbfb]'>
          <div className='xl:max-w-6xl w-full mx-auto'>
            <h2 className='text-4xl font-bold text-black'>Geeks List</h2>
          </div>
        </div>
      </div>

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
                    ? geeks.map((geek, index) => (
                        <button
                          onClick={() => handleClick(geek._id)}
                          key={index}
                          className='flex flex-col items-center bg-white gap-3 shadow rounded-lg p-4'
                        >
                          <Image
                            loader={azureLoader}
                            src={geek.profileImage?.url || "/assets/images/placeholder_user.jpg"}
                            alt={geek.fullName?.first || "Geek"}
                            width={500}
                            height={300}
                            className='rounded-md w-full h-54 object-cover'
                          />
                          <div className='w-full flex flex-col gap-1'>
                            <p className="text-lg text-gray-800">
                              {geek.fullName?.first} {geek.fullName?.last}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {geek.primarySkill?.title || "Skill not available"}
                            </p>
                          </div>
                        </button>
                      ))
                    : (
                      <div className='w-full col-start-2 max-w-6xl mx-auto h-full flex flex-col items-center justify-center'>
                        <div className="flex flex-col items-center justify-center p-4 text-center w-full">
                          <Image
                            loader={azureLoader}
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
