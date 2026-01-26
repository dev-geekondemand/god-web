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
import CustomToast from '@/app/components/CustomToast';
import toast from 'react-hot-toast';
import CustomInput from '@/app/components/CustonInput';
import GeekSkeletonCard from '@/app/components/GeekSkeletenCard';
import { fetchUserLocation } from '@/features/locationSlice';

interface GeekState {
  geeks: Geek[];
  total: number;
  pages: number;
  page: number;
}

const LIMIT = 12; // items per page

const GeeksByCategories = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const city = searchParams.get('city') || '';
  const brandId = useParams().brandId;
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    city: city ||'',
    state:'',
    brandId: brandId ||'',
  })

  console.log(searchParams);
  


 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
    const params = useParams()
    const id = params.id;
    

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
    dispatch(searchGeeks({ page: newPage, limit: LIMIT }));
  };

  const  geekState  = useSelector((state: RootState) => state.geek?.geeks) as unknown as GeekState;
  const curCity = useSelector((state: RootState) => state.location.city);
  
  

  useEffect(() => {
    if (curCity) {
      setFilters(prev => ({ ...prev, city: curCity }));
    }else{
      dispatch(fetchUserLocation())
    }
  }, [curCity, dispatch]);

const router= useRouter();

  const totalPages = geekState?.pages;

  const isAuthenticated = useSelector(
    (state: RootState) => state.seeker.isAuthenticated
  );

  const isGeekAuthenticated = useSelector(
    (state: RootState) => state.geek.isAuthenticated
  );

  useEffect(() => {
    dispatch(searchGeeks({ skill: id,...filters, page, limit: LIMIT }));
  }, [dispatch,filters, id, page]);


  const handleSubmit = () => {
    setPage(1); 
    setLoading(true);
    dispatch(searchGeeks({ ...filters, page: page, limit: LIMIT }));
  };

   

  const handleClick=(geekId:string)=>{
    if(isAuthenticated || isGeekAuthenticated ){
      router.push(`/geeks/${geekId}?categoryId=${id}`,{});
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
const azureLoader = ({ src }:{src:string}) => src;


const geeks = geekState?.geeks as Geek[];

 useEffect(() => {
    if (geeks) {
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [geeks]);
  

  return (
    <section className='w-full flex flex-col items-center justify-center'>
      <div className='w-full relative breadcrumb-bg-2'>
        <div className='w-full breadcrumb-bg py-10 text-center bg-[#fbfbfb]'>
          <div className='xl:max-w-6xl w-full mx-auto'>
            <h2 className='text-4xl font-bold text-black'>Geeks List</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col  w-full py-20 gap-4 max-w-7xl mx-auto justify-center items-center">
      
        <div className="max-w-7xl p-6 mx-auto w-full  flex justify-center items-center">
          <div className=' bg-white items-center justify-center shadow rounded-lg gap-5 p-4 w-full max-w-5xl mx-auto flex md:flex-row flex-col'>
            {/* <h3 className="text-xl font-bold ">Filters: </h3> */}

            <div className='flex md:flex-row flex-col gap-4 w-full justify-center items-center'>
              <div className='flex w-full items-center gap-3'>
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

            <div className='flex w-full items-center gap-3'>
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
            </div>

            <div className='flex justify-center items-center text-nowrap'>
              <button
              onClick={handleSubmit}
              className='bg-gray-800 text-sm text-white hover:bg-black transition px-4 w-full py-2 rounded-md '
            >
              Apply Filters
            </button>
            </div>
          </div>
        </div>


        {/* Geeks List */}
        <div className="p-2 max-w-5xl mx-auto w-full flex flex-col justify-center ">
          <div className="bg-white p-4 mb-4 text-2xl font-bold">
            {geekState?.total > 0 && <h3 className='flex items-center gap-2'>Found <span className='text-teal-600'>{geekState?.total}</span> Geeks</h3>}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 '>
                {loading
                  ? Array.from({ length: LIMIT }).map((_, index) => (
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
                                                <button onClick={()=>{setFilters({city: "", state: "", brandId: brandId ?? ""})}} className='bg-teal-600 text-white rounded-lg px-6 py-2.5 cursor-pointer hover:bg-teal-700'>Clear Filters</button>
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

export default GeeksByCategories;
