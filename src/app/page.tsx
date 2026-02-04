"use client"

import Image from 'next/image.js';
import Categories from './components/Categories.tsx';
import FeaturedGeeks from './components/FeaturedGeeks.tsx';
import HeroSectionTen from './components/Hero.tsx'
import Reviews from './components/Reviews.tsx';
import BlogsSection from './components/BlogsSection.tsx';
import Buisness from './components/Buisness.tsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chat from './components/Chat.tsx';
// import toast from 'react-hot-toast';
// import CustomToast from './components/CustomToast.tsx';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/lib/store.ts';
import Genie from './components/Genie.tsx';
import { useSelector } from 'react-redux';
import Brand from '@/interfaces/Brand.ts';
import Marquee from 'react-fast-marquee';
import { useAppDispatch } from '@/lib/hooks.ts';
import { getBrands } from '@/features/brands/brandsSlice.ts';
import GlobalSkeleton from './components/Sekeletn.tsx';



export default function Home() {

  const router = useRouter();
  const [openChat,setOpenChat] = useState(false);
  const [userType, setUserType] = useState("seeker");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }else{
      setUserType("");
    }
  }, []);

  useEffect(()=>{
    if(!brands.length){
      dispatch(getBrands()); 
    }
  },[])

  // const isAuthenticated = useSelector((state: RootState) => state.seeker.isAuthenticated);

  // const handleClick = (e: React.MouseEvent)=>{
  //   e.preventDefault();
    
  //   if(userType === "seeker" && isAuthenticated){
  //     setOpenChat(true);
  //   } else {
  //     toast.dismiss();
  //     toast.custom((t) => (
  //       <CustomToast
  //         t={t}
  //         title="Not a Seeker"
  //         message="You are not logged in as a Seeker"
  //         avatar="/assets/logo-big.webp"
  //       />
  //     ));
  //   }
  // }

  const brands = useSelector((state: any) => state.brand?.brands);

  
  const azureloader = ({src}:{src:string})=>{return src}


  return (
    <>
      <div>
      <HeroSectionTen   />
      <Categories />
       

                <div hidden={!openChat || userType !== "seeker"} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>

                {openChat && userType === "seeker" && <div className='fixed h-[90vh] flex top-5 overflow-y-scroll custom-scrollbar bottom-5 right-0 left-0  items-center justify-center  max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 '>
                    <Chat isExpanded={openChat} setIsExpanded={setOpenChat}  setOpenChat={setOpenChat} />
                </div>}


      <section className='pt-8 p-3 w-full flex justify-center'>
        <div className='max-w-7xl w-full flex flex-col justify-center items-center py-12 sm:px-10 px-4  bg-amber-800/10 relative rounded-3xl'>
            <div className='flex flex-col text-white max-w-2xl items-center justify-center w-full mx-auto gap-3'>
              <h1 className="text-4xl font-bold text-center text-gray-600">Tech Support in <span className='text-teal-700'>3 Simple Steps</span></h1>
                <p className="text-xs font-medium text-gray-700 text-center">From booking to resolution, getting expert IT Tech support has never been easier.</p>
            </div>
            <div className='flex lg:flex-row flex-col mt-12 gap-6 justify-center items-between w-full'>
              <div className='flex w-full text-center text-black gap-3 justify-center items-center'>
                      <div className='flex flex-col items-center justify-center text-center'>
                        <Image src={"/assets/New-Img/search.png"} className='mb-8' alt='Work-01' width={70} height={70} />
                        <h4 className="text-xs font-bold">1. Search for Geeks.</h4>
                        <p className='text-xs max-w-[220px] font-medium'>
                          Search for IT Tech Support Geeks near your location that best fit your needs.
                          </p>
                      </div>
              </div>
              
              <div className='flex w-full text-black gap-3 justify-center items-center'>
                      <div className='flex flex-col items-center justify-center text-center'>
                        <Image src={"/assets/New-Img/check-pad.png"} className='mb-8' alt='Work-02' width={90} height={90} />
                        <h4 className="text-xs font-bold">2.  Getting Booked & Job done.</h4>
                        <p className='text-xs max-w-[250px]  font-medium'>
                          Once you find a Geek that best fits your needs, get booked and get your job done.
                          </p>
                      </div>
                       
              </div>

             <div className='flex w-full text-center text-black gap-3 justify-center items-center'>
                      <div className='flex flex-col items-center justify-center text-center'>
                        <Image src={"/assets/New-Img/star.png"} className='mb-8' alt='Work-02' width={70} height={70} />
                        <h4 className="text-xs font-bold">3. Rate and Review the service.</h4>
                        <p className='text-xs max-w-[250px] font-medium'>
                          After your job is complete, you can rate and review the Geeks according to your experience so that others can know about them.
                          </p>
                      </div>
              </div>

            </div>
        </div>

      </section>

      <section className=' dark:text-gray-200    w-full max-w-7xl mx-auto  mt-10'>
                          <div className='flex flex-col gap-5 max-w-7xl mb-12 relative justify-center items-center mx-auto'>
                          <h1 className='h2'>Brands Served by our Geeks</h1>
                          
                          
                          </div>
                      {brands?.length > 0 ?
                            <Marquee
                                className='bg-gray-100 dark:bg-gray-900'
                            >
                            
                              <div className='flex gap-16 p-6 '>
                                {brands?.map((brand:Brand) => (
                                    <Image loader={azureloader} key={brand?._id} width={100} height={80} className='object-contain' src={brand?.image?.url ? brand?.image?.url : "/assets/images/plc.webp"} alt="brand image" />
                                ))}
                            </div> 
        
                            </Marquee>
                          : <div className='w-full h-36 overflow-hidden'><GlobalSkeleton cards={1} cols={1} lgCols={1} /></div>}
                          
                      </section> 

        <div className='w-full p-3 flex flex-col items-center justify-center'>
        <FeaturedGeeks  />
        <Reviews />
        </div>
      </div>

      <section className='w-full p-3 bg-amber-800/10 max-w-7xl mx-auto rounded-md relative'>
        <div className='flex md:w-[90%] md:flex-row flex-col gap-3 justify-between px-4  py-12'>
            <div className='flex flex-col md:px-12 text-white  items-start justify-start w-full gap-2'>
              <h1 className="h2 text-start text-gray-700">Join the Network of  <span className='text-teal-700'>Trusted Geeks </span></h1>
              <p className="font-medium text-xs text-gray-700 text-start">Get verified, showcase your skills, and become part of India’s first on-demand IT Tech support platform.</p>

            </div>

            <div>
               <button 
                    onClick={()=>{router.push('/register?type=geek')}} 
                    className="mt-4 flex items-center text-nowrap tracking-wider cursor-pointer gap-1 w-fit px-8 py-2.5 bg-teal-700 text-lg text-white rounded-md"
                    >
                        Join Us
                        
                    </button>
            </div>

        </div>
      </section>

      <BlogsSection />
      <Buisness />
          <Genie />



     
    </>
  );
}
