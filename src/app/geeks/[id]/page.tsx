"use client"

import { getGeekById } from '@/features/geek/geekSlice'
import { useAppDispatch } from '@/lib/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Geek from '@/interfaces/Geek'
import { Category, } from '@/interfaces/Category'
import { createRequest, getSeekerRequests } from '@/features/request/requestSlice'
import User from '@/interfaces/Seeker'
import DialogComponent from '@/app/components/Dialog'
import { ServiceRequest } from '@/interfaces/ServiceRequest'
import Brand from '@/interfaces/Brand'
import { getBrands } from '@/features/brands/brandsSlice'
import GlobalSkeleton from '@/app/components/Sekeletn'

interface SkillWithBrands {
  category: Category;
  brands: Brand[];
}


const GeekById = () => {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = params.id;
    
    const catId=useSearchParams().get('categoryId');
    const categoryId = catId && catId !== 'undefined' ? catId : null;

    

    

    const [skills,setSkills] = useState<Category[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<Category>();
    const [selectedMode, setSelectedMode] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [isSeekerAddress, setIsSeekerAddress] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isRequestedService,setIsRequestedService] = useState(false);
    const [primarySkillBrands, setPrimarySkillBrands] = useState<Brand[]>([]);
    const [secondarySkillsWithBrands, setSecondarySkillsWithBrands] = useState<SkillWithBrands[]>([]);

    useEffect(()=>{
        if(id){
            dispatch(getGeekById(id.toString()));
            dispatch(getBrands());
            dispatch(getSeekerRequests());
        }else{
            toast.error('Geek not found');
        }

    },[dispatch, id])

    const geek = useSelector((state: RootState) => state.geek?.geekById) as Geek;
    const loggedInGeek = useSelector((state: RootState) => state.geek?.geek) as Geek;
    const isGeekLoading = useSelector((state:RootState)=>state.geek?.isLoading)
    const loggedInSeeker = useSelector((state: RootState) => state.seeker?.user) as User;
    const requestState = useSelector((state: RootState) => state.request);
    const seekerRequests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[];
    const brands = useSelector((state: RootState) => state.brand?.brands) as Brand[];
 
        
    const [overView,setOverview] = useState(true);
    const [expertise,setExpertise] = useState(true);
    const [benefits,setBenefits] = useState(false);

    useEffect(()=>{
        if(geek?.primarySkill){
            setSkills([geek?.primarySkill,...geek?.secondarySkills]);
        }
    },[geek?.primarySkill, geek?.secondarySkills])


 const azureLoader = ({ src }:{src:string}) => src;



 const handleClick = async()=>{
    setIsLoading(true);
    if(!selectedMode){
        setShowDialog(true);
        setIsLoading(false);
        return;
    }

    if(!geek?._id){
        toast.error('Geek not found');
        setIsLoading(false);
        return;
    }

    if(loggedInGeek?._id === geek._id){
        toast.error('You cannot book your own service');
        setIsLoading(false);
        return;
    }

    if(!loggedInSeeker?._id){
        toast.error('You are not logged in as a Seeker.');
        setIsLoading(false);
        return;
    }
    const finalCategoryId = selectedSkill?._id || categoryId;
    if (!finalCategoryId) {
            toast.error('Please select a category from below.');
            setIsLoading(false);
            return;
            }

    if(selectedMode === 'Offline' && !isSeekerAddress){
        toast.error('Please add your address.');
        setIsLoading(false);
        return;
    }
    
    if (requestState?.requests?.length > 0) {
        const alreadyExists = seekerRequests?.some((request: ServiceRequest) => {
            return request?.category?._id === selectedSkill?._id && request?.geek?._id === geek?._id && request?.geekResponseStatus === 'Pending';
        })

        if (alreadyExists) {
            toast.error('You already have a pending request for this category.');
            setIsLoading(false);
            return;
        }
    }

    if(geek?._id && (selectedSkill || categoryId) && selectedMode){
        setIsLoading(true);
        await dispatch(createRequest({
            geek: geek._id,
            category: selectedSkill?._id as string || categoryId as string,
            issue: '',
            mode: selectedMode || "Online",
            location:{
                city: '',
                state: '',
                line1: ''
            }
        }));

        dispatch(getSeekerRequests());
        
    }else{
        console.log(geek, selectedSkill, selectedMode);
    }
    setIsLoading(false);
 }


 useEffect(()=>{
    const isRequestedService = (requestState?.requests as ServiceRequest[] | undefined)?.some(
    (request) => request?.geek?._id === geek?._id && request?.geekResponseStatus === 'Accepted'
    );

    // console.log(requestState?.requests, isRequestedService);

    
    if (isRequestedService) {
        setIsRequestedService(true);
    }
 },[requestState, geek?._id]);

 useEffect(()=>{
    if(requestState?.isRequestCreated){
        toast.dismiss();
        toast.success('Request created successfully.');
    }
 },[ requestState?.isRequestCreated])

useEffect(()=>{
    if(loggedInSeeker?.address?.city){
        setIsSeekerAddress(true);
    }
},[loggedInSeeker?.address?.city])


useEffect(() => {
  if (!geek || brands.length === 0 ) return;

  const primaryCategoryId = geek.primarySkill?._id;

  const primaryBrands = brands.filter(
    b =>
      b.category?._id === primaryCategoryId &&
      geek.brandsServiced?.some(gb => gb._id === b._id)
  );
  setPrimarySkillBrands(primaryBrands);

  const secondarySkills: SkillWithBrands[] =
    geek.secondarySkills?.map(cat => ({
      category: cat,
      brands: brands.filter(
        b =>
          b.category?._id === cat._id &&
          geek.brandsServiced?.some(gb => gb._id === b._id)
      ),
    })) || [];

    setSecondarySkillsWithBrands(secondarySkills);


}, [geek, brands]);



const getSecondarySkillsWithBrands = (
  secondarySkills: Category[] = [],
  brands: Brand[] = []
) => {
  return secondarySkills.map(skill => ({
    category: skill,
    brands: brands.filter(
      b => b.category?._id === skill._id
    ),
  }));
};



const getPrimarySkillBrands = (
  primarySkill: Category,
  brands: Brand[] = []
) => (  brands.filter(b => b.category?._id === primarySkill._id));



  return (
    <section className='w-full  flex flex-col items-center justify-center'>
        <div className='w-full relative breadcrumb-bg-2'>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>Geek Details</h2>
                            <div className='flex gap-2 items-center'>
                            <Link href="/" className='cursor-pointer'>
                        <svg className='w-4 h-4 ' 
                        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         stroke="#009689"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                         <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                         <g id="SVGRepo_iconCarrier"> 
                          <path d="M22 22L2 22" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M4 22V9.5" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M20 22V9.5" stroke="#009689" strokeWidth="1.5" strokeLinecap="round"></path> 
                          <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#009689" strokeWidth="1.5"></path> 
                          </g>
                          </svg>
                        </Link>

                            <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                            </svg>
                            <p className=' text-gray-600'>Geek Details</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        
        </div>

        <div className='w-full flex flex-col gap-8 items-center justify-center py-20 px-3 bg-gray-50'>
            <div className='max-w-7xl mx-auto bg-white w-full flex flex-col items-center justify-center'>
                {isGeekLoading ? <GlobalSkeleton cards={1} cols={1} lgCols={1} /> : <div className='w-full grid lg:grid-cols-12 md:grid-cols-6 grid-cols-1  gap-4 shadow-md rounded-md '>
                    <div className='md:col-span-5 col-span-1 flex sm:flex-col md:flex-row gap-4 p-5'>
                        <Image 
                        
                        loader={azureLoader}
                        src={geek?.profileImage?.url ? geek?.profileImage?.url : "/assets/images/placeholder_user.jpg"}
                        alt='provider-2' 
                        width={150} 
                        height={100} 
                        className="w-[150px] h-[140px] object-cover rounded-md" />
                        <div className='flex flex-col gap-1.5 items-start justify-start mt-3'>
                            <h2 className='text-xl md:text-3xl  font-bold text-black'>{geek.fullName?.first + " " + geek.fullName?.last}</h2>
                            <p className='text-gray-600'>{geek?.primarySkill?.title}.</p>
                            {/* <p className='text-gray-600 flex gap-2 items-center text-sm'>Member Since <span className='font-semibold'>{new Date(geek.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p> */}
                        </div>
                    </div>

                    <div className='lg:col-span-3 col-span-1 md:col-span-2 flex flex-col flex-wrap gap-4 p-5'>
                        <div className='flex flex-col flex-wrap gap-1.5 items-start justify-center'>
                            <h6 className='text-gray-700'>Email</h6>
                            <p className='text-gray-500 break-all'>{geek?.email && isRequestedService ? geek?.email : geek?.email ?  "**********" + ".com" : "N/A"  }</p>
                        </div>

                        <div className='flex flex-col gap-1.5 items-start justify-center'>
                            <h6 className='text-gray-700'>Phone Number</h6>
                            <p className='text-gray-500'>{isRequestedService ? geek?.mobile : geek?.mobile?.slice(0, 2) + "********" + geek.mobile?.slice(geek?.mobile?.length - 2)}</p>
                        </div>
                    </div>

                    <div className='lg:col-span-2 col-span-1 md:col-span-2 flex flex-col gap-4 p-5'>
                        <div className='flex flex-col gap-1.5 items-start justify-center'>
                            <h6 className='text-gray-700'>Languages Known</h6>
                            <p className='text-gray-500'>{geek?.languagePreferences && geek.languagePreferences?.length !==0 ? geek.languagePreferences?.map((lang) => lang).join(", "): "N/A"}</p>
                        </div>

                        <div className='flex flex-col gap-1.5 items-start justify-center'>
                            <h6 className='text-gray-700'>Address</h6>
                            <p className='text-gray-500'>{geek?.address?.city ? geek?.address?.city + ", " +  geek?.address?.state : "N/A"}</p>
                        </div>
                    </div>


                    <div className='lg:col-span-2 col-span-1 md:col-span-2 flex flex-col gap-4 p-5'>
                        
                        {/* <div className='flex flex-col gap-1.5 items-start justify-center'>
                            <h6 className='text-gray-700'>Social Profiles</h6>
                            <div className='flex gap-2 items-center'>
                                <Image src={"/assets/icons/fb.svg"} alt='Whatsapp' width={22} height={22} />
                                <Image src={"/assets/icons/instagram.svg"} alt='Whatsapp' width={22} height={22} />
                                <Image src={"/assets/icons/whatsapp.svg"} alt='Whatsapp' width={22} height={22} />
                                <Image src={"/assets/icons/linkedIn.svg"} alt='linkedIn' width={22} height={22} />
                                <Image src={"/assets/icons/twitter.svg"} alt='twitter' width={22} height={22} />
            
                            </div>
                        </div> */}
                        <button onClick={handleClick} className='w-full cursor-pointer md:w-36 h-10 rounded-md bg-teal-500 text-white font-bold hover:bg-teal-600'>{isLoading ? "Booking..." : "Book Service"}</button>

                        { showDialog && <DialogComponent
                        modes={geek?.modeOfService=== "All" || geek?.modeOfService=== "None" ? ["Online", "Offline", "Carry In"] : [geek?.modeOfService]}
                         selectedMode={selectedMode}
                         setSelectedMode={setSelectedMode}
                         seekerId={loggedInSeeker?._id}
                         showDialog={showDialog}
                         setShowDialog={setShowDialog}
                         openBtnText={"Select Mode"}
                         title={"Select Mode"}
                         titleDesc={"Select Mode of Service"} 
                         onSubmit={()=>{setShowDialog(false)}}
                         isSeekerAddress={isSeekerAddress}
                        />}
                    </div>

                </div>}
            </div>

            <div className='max-w-7xl  mx-auto w-full flex flex-col items-center justify-center'>
                <div className='w-full md:grid md:grid-cols-12 flex flex-col-reverse gap-8'>

                    {isGeekLoading ? <div className='flex md:col-span-8 col-span-12 min-h-[300px] flex-col shadow-md gap-3 h-fit bg-white rounded-lg p-5'><GlobalSkeleton cards={1} lgCols={1} cols={1} /></div> : <div className='flex md:col-span-8 col-span-12 flex-col shadow-md gap-3 h-fit bg-white rounded-lg p-5'>
                        <div className={`flex flex-col gap-4 ${overView ? "border-b border-b-gray-200" :""} pb-6`}>
                            <button onClick={()=>{setOverview(!overView)}}  className='w-full cursor-pointer flex justify-between'>
                                <span className='text-xl font-bold'>
                                    Overview
                                </span>
                                <svg viewBox="0 0 1024 1024" className={`icon ${overView && "rotate-180"}  w-5 h-5`} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>

                                
                            </button>
                            <p className={`text-gray-500 ${!overView ? "hidden" : ""}`}>
                                Hello Seeker, I am {geek?.fullName?.first + " " + geek?.fullName?.last} from {geek?.address?.city}, {geek?.address?.state}. I have been delivering quality service to people like yourself for the past {geek?.yoe} years in the field of {geek?.primarySkill?.title}.
                                If you are looking for geeks in the city of {geek?.address?.city}, for a hassle free solution  for any of the problems related to {geek?.primarySkill?.title} at a resonable price, you can  book my service by clicking the <b>Book Service</b> button.
                               { geek?.email && <span>You can also email me at <a className='hover:underline' href={`mailto:${geek?.email}`}>{isRequestedService ? geek?.email : "***********" + ".com" }</a></span>}.
                            </p>
                        </div>

                        <div className={`flex flex-col gap-4 ${expertise ? "border-b border-b-gray-200" : ""} pb-6`}>
                            <button onClick={()=>{setExpertise(!expertise)}}  className='w-full cursor-pointer flex justify-between'>
                                <span className='text-xl font-bold'>
                                Areas Of Expertise
                                </span>
                                <svg viewBox="0 0 1024 1024" className={`icon ${expertise && "rotate-180"}  w-5 h-5`} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>
                            </button>
                            <div className={`text-gray-500 flex flex-col gap-3 ${!expertise ? "hidden" : ""}`}>
                                <div className="w-full flex flex-col gap-3">
                        <h3 className="h5">Primary Skill:</h3>

                        {geek?.primarySkill ? (
                            <div className="flex flex-col gap-4">
                            <div className="border border-gray-200 rounded-md p-3">
                                <p className="font-medium text-sm text-gray-800 mb-2">
                                {geek?.primarySkill?.title}
                                </p>
                                <div className='flex gap-3 flex-wrap'>
                                    {
                                    primarySkillBrands.map((brand) => (
                                        <p key={brand._id} className="text-xs rounded-md p-1.5  bg-gray-100 ">
                                        {brand.name}
                                        </p>
                                    ))
                                }
                                </div>
                            </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No primary skill added</p>
                        )}

                        
                        
                    </div>

                

                   <div className="w-full flex flex-col gap-3">
                        <h3 className="h5">Secondary Skills:</h3>

                        {secondarySkillsWithBrands?.length === 0 ? (
                            <p className="text-sm text-gray-500">No secondary skills added</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                            {secondarySkillsWithBrands.map(({ category, brands }) => (
                                <div
                                key={category._id}
                                className="border border-gray-200 rounded-md p-3"
                                >
                                <p className="font-medium text-sm text-gray-800">
                                    {category.title}
                                </p>

                                {brands.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                    {brands?.map((brand,index) => (
                                        <span
                                        key={index + 10}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                                        >
                                        {brand.name}
                                        </span>
                                    ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">
                                    No brands selected
                                    </p>
                                )}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>

                                
                                {/* <div className='flex flex-col gap-2'>
                                    <h6 className='font-semibold mt-2 text-gray-700'>Brands Serviced: </h6>
                                    <div className='flex flex-wrap gap-3'>
                                        {geek?.brandsServiced && geek?.brandsServiced.length > 0 && geek.brandsServiced.map((brand: BrandsServiced,index:number) => (
                                            <p key={index+20000}>{index < geek?.primarySkill?.subCategories.length - 1 ? brand.name + "," : brand.name}</p>
                                        ))}
                                    </div>

                                </div> */}

                            </div>
                        </div>

                        <div className={`flex flex-col gap-4 ${benefits ? "border-b border-b-gray-200" : ""} pb-6`}>
                            <button onClick={()=>{setBenefits(!benefits)}}  className='w-full cursor-pointer flex justify-between'>
                                <span className='text-xl font-bold'>
                                Benefits
                                </span>
                                <svg viewBox="0 0 1024 1024" className={`icon ${benefits ? "rotate-180" :""}  w-5 h-5`} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>
                            </button>
                            <div className={`text-gray-500 flex-wrap ${!benefits ? "hidden" : "flex gap-8"}`}>
                                <div className='border text-nowrap px-3.5 py-2.5 flex items-center gap-2 rounded-sm'>    
                                    <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g strokeWidth="0"></g>
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g>
                                            <g>
                                                <g>
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.5303 10.0303C16.8232 9.73744 16.8232 9.26256 16.5303 8.96967C16.2374 8.67678 15.7626 8.67678 15.4697 8.96967L10.8434 13.5959C10.7458 13.6935 10.5875 13.6935 10.4899 13.5959L8.53033 11.6363C8.23744 11.3434 7.76256 11.3434 7.46967 11.6363C7.17678 11.9292 7.17678 12.4041 7.46967 12.697L9.42923 14.6566C10.1126 15.34 11.2207 15.34 11.9041 14.6566L16.5303 10.0303Z"
                                                    fill="#000000"
                                                />
                                                </g>
                                            </g>
                                            </g>
                                        </svg>                                
                                    Warranty and Support
                                </div>

                                <div className='border text-nowrap px-3.5 py-2.5 flex items-center gap-2 rounded-sm'>    
                                    <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g strokeWidth="0"></g>
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g>
                                            <g>
                                                <g>
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.5303 10.0303C16.8232 9.73744 16.8232 9.26256 16.5303 8.96967C16.2374 8.67678 15.7626 8.67678 15.4697 8.96967L10.8434 13.5959C10.7458 13.6935 10.5875 13.6935 10.4899 13.5959L8.53033 11.6363C8.23744 11.3434 7.76256 11.3434 7.46967 11.6363C7.17678 11.9292 7.17678 12.4041 7.46967 12.697L9.42923 14.6566C10.1126 15.34 11.2207 15.34 11.9041 14.6566L16.5303 10.0303Z"
                                                    fill="#000000"
                                                />
                                                </g>
                                            </g>
                                            </g>
                                        </svg>                                
                                    Workmanship Guarentee
                                </div>

                                <div className='border text-nowrap px-3.5 py-2.5 flex items-center gap-2 rounded-sm'>    
                                    <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g strokeWidth="0"></g>
                                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g>
                                            <g>
                                                <g>
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.5303 10.0303C16.8232 9.73744 16.8232 9.26256 16.5303 8.96967C16.2374 8.67678 15.7626 8.67678 15.4697 8.96967L10.8434 13.5959C10.7458 13.6935 10.5875 13.6935 10.4899 13.5959L8.53033 11.6363C8.23744 11.3434 7.76256 11.3434 7.46967 11.6363C7.17678 11.9292 7.17678 12.4041 7.46967 12.697L9.42923 14.6566C10.1126 15.34 11.2207 15.34 11.9041 14.6566L16.5303 10.0303Z"
                                                    fill="#000000"
                                                />
                                                </g>
                                            </g>
                                            </g>
                                        </svg>                                
                                        Energy-Efficient Solutions
                                </div>
                            </div>
                        </div>
                    </div>}


                   <div className='flex md:col-span-4 col-span-12 sm:col-span-8 flex-col h-fit overflow-y-scroll custom-scrollbar  gap-3 shadow-md bg-white rounded-lg p-5'>
                    
                        <h3 className="text-2xl mb-2 text-gray-800 font-bold">Select Category</h3>
                        

                        {isGeekLoading ?<div className='w-full flex flex-col gap-4'> <GlobalSkeleton cards={1} cols={1} lgCols={1} /></div> :<div className='w-full flex flex-col gap-4'>
                            {skills?.map((skill: Category, index: number) => (
                                <div onClick={() => setSelectedSkill(skill)} key={index} className={`flex items-center bg-gray-100 hover:scale-105 transition transform duration-300  py-2.5 px-4 rounded-md gap-2 cursor-pointer ${selectedSkill?._id === skill?._id ? "border-1 border-teal-500" : ""}`}>
                                    <div className='w-9 h-9 border flex gap-2 relative border-black rounded-full'>
                                        <Image objectFit='cover'  loader={azureLoader} className='rounded-full' src={skill?.image?.url} alt="Category Image" layout='fill'  />           
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-sm font-semibold text-gray-800'>{skill.title}</p>                                        
                                    </div>
                                </div>
                            ))}
                        </div>}


               
                    </div>

                </div>
            </div>
        </div>
    </section>
  )
}

export default GeekById
