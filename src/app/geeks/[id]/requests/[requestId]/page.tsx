'use client';

import React, { useEffect, useState } from 'react';
import { useParams, } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { fetchRequestById } from '@/features/requestRequests/requestRequestSlice';
// import UploadMedia from '@/app/components/UploadMedia';
import Image from 'next/image';
import { getRequestById } from '@/features/request/requestSlice';
import { RootState } from '@/lib/store';
import MediaUploader from '@/app/components/UploadMedia';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { SubCategory } from '@/interfaces/Category';
import { Review, ServiceRequest } from '@/interfaces/ServiceRequest';
import User from '@/interfaces/Seeker';
import { useSelector } from 'react-redux';
import Geek from '@/interfaces/Geek';


const SingleRequestPage = () => {
  const requestId = useParams().requestId as string;
  const dispatch = useAppDispatch();

  const geekId = useParams()?.id as string;

      const [overView,setOverview] = useState(true);
      const [includes,setIncludes] = useState(true);
      const [gallary,setGallary] = useState(true);
      const [uploadedMedia, setUploadedMedia] = useState(false);


      const seeker = useSelector((state:RootState) => state.seeker?.user) as User;
      const curGeek = useSelector((state:RootState) => state.geek?.geek) as Geek;



  useEffect(() => {
    dispatch(getRequestById(requestId));
  }, [dispatch, requestId]);

  const azureLoader = ({ src }:{src:string}) => src;


  const request = useAppSelector((state:RootState) => state.request?.request) as ServiceRequest;

  return (
<section className='w-full h-full relative flex flex-col items-center justify-center gap-5'>

<div hidden={!uploadedMedia} onClick={() => setUploadedMedia(false)} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>

                {uploadedMedia && <div className='fixed flex top-10 h-[70vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0  items-center justify-center  max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 '>
                    <MediaUploader requestId={requestId} isUploadedOpen={uploadedMedia} setIsUploadedOpen={setUploadedMedia}  />
                </div>}
    
  
        <div className='w-full relative breadcrumb-bg-2'>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#e3e3e3]'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>{request?.category?.title}</h2>
                            <div className='flex gap-2 mt-2 items-center'>
                            <Link href="/" className='cursor-pointer'>
                            <svg className='w-4 h-4 ' 
                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            stroke="#f708ab"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                              <path d="M22 22L2 22" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                              <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                              <path d="M4 22V9.5" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                              <path d="M20 22V9.5" stroke="#ee0b8b" strokeWidth="1.5" strokeLinecap="round"></path> 
                              <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ee0b8b" strokeWidth="1.5"></path> 
                              </g>
                              </svg>
                            </Link>

                              <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                              </svg>
                              <Link href={`geeks/${geekId}/requests`} className='cursor-pointer text-sm hover:text-teal-600'>
                                  My Services
                                </Link>
                                    <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                    <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                                </svg>

                                <p className='text-sm text-gray-500'>{request?.category?.title}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          
        </div>
    <div className="grid py-20 grid-cols-12 gap-4 w-full max-w-7xl mx-auto">
                <div className=' md:col-span-8 col-span-12  flex flex-col gap-6 '>
                    <div className='bg-white rounded-lg shadow-md px-4 py-6 max-h-screen overflow-y-scroll custom-scrollbar  w-full flex flex-col gap-6'>
                        <div className='w-full flex justify-between'>
                        <div className='w-full flex flex-col gap-3'>
                            <h2 className="h3">{request?.category?.title}</h2>
                            <div className='flex gap-5 text-sm items-center text-gray-500'>
                                <p className=" ">{request?.address ? request?.address?.city + ", " + request?.address?.state : request?.geek?.address?.city + ", " + request?.geek?.address?.state}</p>
                                <div className='flex gap-1 items-center'>
                                <Image src={"/assets/icons/star.svg"} alt="Star" width={13} height={13} />
                                {request?.totalRating}({request?.reviews?.length} Reviews)
                                </div>
                            </div>
                        </div>
                        <div className=' flex flex-col justify-between items-end'>
                            <p className={`text-xs w-fit text-nowrap px-2 rounded-xs font-bold py-0.5 ${request?.status === "Pending"  || request?.status === "Matched" ? "bg-yellow-100 text-yellow-600" : request?.status === "Accepted" || request?.status === "Completed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{request?.status}</p>
                            {/* <p className='text-sm w-fit text-nowrap px-2 rounded-xs text-gray-600 py-0.5 '>Add to Wishlist</p> */}
                        </div>
                        </div>
                        <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                        >
                        <CarouselContent>
                            {/* {request?.images && request?.images?.length>0 ? request?.images?.map((img:{public_id: string, url: string}) => (
                            <CarouselItem key={img.public_id} className="md:basis-1/1 lg:basis-1/1">
                                
                                <Card className='py-0 px-0'>
                                    <CardContent className="flex h-[380px] w-full relative items-center justify-center ">
                                    <Image
                                        className="h-fit rounded-lg"
                                        src={img?.url ? img?.url : "/assets/images/blogImg.jpg"}
                                        alt="Image 1"
                                        layout='fill'
                                    />
                                    </CardContent>
                                </Card>
                            
                            </CarouselItem>
                            )):  */}
                            <CarouselItem className="md:basis-1/1 lg:basis-1/1">
                                <Card className='py-0 px-0'>
                                    <CardContent className="flex h-[380px]  relative items-center justify-center ">
                                    <Image
                                        loader={azureLoader}
                                        className="h-fit rounded-lg object-cover"
                                        src={request?.category?.image?.url ? request?.category?.image?.url : "/assets/images/blogImg.jpg"}
                                        alt="Image 1"
                                        layout='fill'
                                    />
                                    </CardContent>
                                </Card>
                                
                                </CarouselItem>
                        </CarouselContent>
                        {/* <CarouselPrevious className='-left-3 hover:bg-teal-500 hover:text-white' />
                        <CarouselNext className='-right-3 hover:bg-teal-500 hover:text-white' /> */}
                        </Carousel>
    
                        <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                        >
                        <CarouselContent>
                            {request?.images && request?.images?.length>0 && request?.images.map((img:{public_id: string, url: string}) => (
                            <CarouselItem key={img.public_id} className="sm:basis-1/3 basis-1/2 md:basis-1/4">
                                
                                <Card className='py-0 px-0'>
                                    <CardContent className="flex h-[110px] relative items-center justify-center ">
                                    <Image
                                        loader={azureLoader}
                                        className="h-fit rounded-lg"
                                        src={img.url ? img.url : "/assets/images/blogImg.jpg"}
                                        alt="Image 1"
                                        layout='fill'
                                    />
                                    </CardContent>
                                </Card>
                            
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        {request?.images && request?.images?.length>0 && <CarouselPrevious className='-left-3 hover:bg-teal-500 hover:text-white' />}
                        {request?.images && request?.images?.length>0 && <CarouselNext className='-right-3 hover:bg-teal-500 hover:text-white' />}
                        </Carousel>
    
                        <div className='w-full flex flex-col gap-4 py-2 items-start'>
                            <button onClick={()=>{setOverview(!overView)}} className='flex cursor-pointer justify-between w-full px-2'>
                                <div className='content flex flex-col w-full'>
                                    <h3 className="text-2xl text-start font-bold ">Service Overview</h3>
    
                                    <div className={`w-full flex flex-col py-2 gap-2 transition transform duration-300 items-start ${overView ? "flex":"hidden "}`}>
                                        <p className='text-gray-500 text-start'>{request?.overview?.description}</p>
    
                                        <div className='flex flex-col gap-3 p-4 rounded bg-gray-50 w-full'>
                                            <h3 className="font-bold text-2xl text-start">Services Offered</h3>
                                            <div className='w-full flex flex-wrap gap-3'>
                                                {request?.category?.subCategories?.map((subCat:SubCategory) => (
                                                        <div key={subCat?._id} className='bg-white rounded-sm shadow-sm px-3 py-2 w-fit flex'>
                                                    
                                                        <div  className='flex flex-col w-full px-4 gap-1'>
                                                            <p className='text-base mb-0 text-start text-black'>{subCat?.title}</p>
                                                            {/* <p className='text-sm text-start text-gray-500'></p> */}
                                                        </div>
                                                    </div>
    
                                                ))}
                                            </div>
                                        </div>
                                    </div>
    
                                    
    
                                </div>
                                <svg viewBox="0 0 1024 1024" className={`icon ${!overView && "rotate-180"}  w-5 h-5`} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>
                            </button>
                        </div>
    
                        <div className='w-full flex flex-col gap-4 py-2 items-start'>
                            <button onClick={()=>{setIncludes(!includes)}} className='flex cursor-pointer justify-between w-full px-2'>
                                <div className='content gap-4 flex flex-col w-full'>
                                    <h3 className="text-2xl text-start font-bold ">Mode of service</h3>
    
                                    <div className={`w-full rounded-sm bg-gray-100 px-3 flex flex-col py-3 gap-2 transition transform duration-300 items-start ${includes ? "flex":"hidden "}`}>
                                        <div className='flex flex-wrap gap-3 items-center w-full'>
                                                 <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2da800"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 15.25C10.307 15.2353 10.1276 15.1455 9.99998 15L6.99998 12C6.93314 11.8601 6.91133 11.7029 6.93756 11.55C6.96379 11.3971 7.03676 11.2562 7.14643 11.1465C7.2561 11.0368 7.39707 10.9638 7.54993 10.9376C7.70279 10.9114 7.86003 10.9332 7.99998 11L10.47 13.47L19 5.00004C19.1399 4.9332 19.2972 4.91139 19.45 4.93762C19.6029 4.96385 19.7439 5.03682 19.8535 5.14649C19.9632 5.25616 20.0362 5.39713 20.0624 5.54999C20.0886 5.70286 20.0668 5.86009 20 6.00004L11 15C10.8724 15.1455 10.6929 15.2353 10.5 15.25Z" fill="#2da800"></path> <path d="M12 21C10.3915 20.9974 8.813 20.5638 7.42891 19.7443C6.04481 18.9247 4.90566 17.7492 4.12999 16.34C3.54037 15.29 3.17596 14.1287 3.05999 12.93C2.87697 11.1721 3.2156 9.39921 4.03363 7.83249C4.85167 6.26578 6.1129 4.9746 7.65999 4.12003C8.71001 3.53041 9.87134 3.166 11.07 3.05003C12.2641 2.92157 13.4719 3.03725 14.62 3.39003C14.7224 3.4105 14.8195 3.45215 14.9049 3.51232C14.9903 3.57248 15.0622 3.64983 15.116 3.73941C15.1698 3.82898 15.2043 3.92881 15.2173 4.03249C15.2302 4.13616 15.2214 4.2414 15.1913 4.34146C15.1612 4.44152 15.1105 4.53419 15.0425 4.61352C14.9745 4.69286 14.8907 4.75712 14.7965 4.80217C14.7022 4.84723 14.5995 4.87209 14.4951 4.87516C14.3907 4.87824 14.2867 4.85946 14.19 4.82003C13.2186 4.52795 12.1987 4.43275 11.19 4.54003C10.193 4.64212 9.22694 4.94485 8.34999 5.43003C7.50512 5.89613 6.75813 6.52088 6.14999 7.27003C5.52385 8.03319 5.05628 8.91361 4.77467 9.85974C4.49307 10.8059 4.40308 11.7987 4.50999 12.78C4.61208 13.777 4.91482 14.7431 5.39999 15.62C5.86609 16.4649 6.49084 17.2119 7.23999 17.82C8.00315 18.4462 8.88357 18.9137 9.8297 19.1953C10.7758 19.4769 11.7686 19.5669 12.75 19.46C13.747 19.3579 14.713 19.0552 15.59 18.57C16.4349 18.1039 17.1818 17.4792 17.79 16.73C18.4161 15.9669 18.8837 15.0864 19.1653 14.1403C19.4469 13.1942 19.5369 12.2014 19.43 11.22C19.4201 11.1169 19.4307 11.0129 19.461 10.9139C19.4914 10.8149 19.5409 10.7228 19.6069 10.643C19.6728 10.5631 19.7538 10.497 19.8453 10.4485C19.9368 10.3999 20.0369 10.3699 20.14 10.36C20.2431 10.3502 20.3471 10.3607 20.4461 10.3911C20.5451 10.4214 20.6372 10.471 20.717 10.5369C20.7969 10.6028 20.863 10.6839 20.9115 10.7753C20.9601 10.8668 20.9901 10.9669 21 11.07C21.1821 12.829 20.842 14.6026 20.0221 16.1695C19.2022 17.7363 17.9389 19.0269 16.39 19.88C15.3288 20.4938 14.1495 20.8755 12.93 21C12.62 21 12.3 21 12 21Z" fill="#2da800"></path> 
                                                    </g></svg>
                                                    {request?.mode}
                                        </div>
                                    </div>
                                    
    
                                    
    
                                </div>
                                <svg viewBox="0 0 1024 1024" className={`icon ${!includes && "rotate-180"}  w-5 h-5`} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>
                            </button>
                        </div>
    
                        {request?.images?.length > 0 && <div className='w-full flex flex-col gap-4 py-2 items-start'>
                            <button onClick={()=>{setGallary(!gallary)}} className='flex cursor-pointer justify-between w-full px-2'>
                                <div className='content gap-4 flex flex-col w-full'>
                                <div className='flex cursor-pointer justify-between w-full px-2'>
                                <h3 className="text-2xl text-start font-bold ">Gallary</h3>
                                <svg viewBox="0 0 1024 1024" className={`icon ${!includes && "rotate-180"}  w-5 h-5`} version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000"></path></g></svg>
                                </div>
    
                                    <div className={`w-full rounded-sm  flex flex-col py-3 transition transform duration-300 items-start ${gallary ? "flex":"hidden "}`}>
                                        <div className='grid grid-cols-6 justify-center gap-4 w-full'>
                                        {request?.images?.map((img:{url:string,public_id:string}, i:number) => (
                                            i < 6 && (
                                                <div className="relative h-20 col-span-2 sm:col-span-1 rounded-md" key={img?.public_id}>
                                                <Image loader={azureLoader} className="rounded-md" src={img?.url as string} layout="fill" alt="Gallary Image" />
                                                </div>
                                            )
                                            ))}
    
                                        </div>
                                    </div>
                                    
    
                                    
    
                                </div>
                                
                            </button>
                        </div>}
    

    
                        
                    </div>
    
                    <div className='bg-white rounded-lg shadow-md px-4 py-4 max-h-screen overflow-y-scroll custom-scrollbar  w-full flex flex-col gap-4'>
                       
                        <div className='flex flex-col items-start w-full px-2'>
                            <h5 className="text-2xl font-bold">Reviews({request?.reviews?.length})</h5>
                            {seeker?._id === request?.seeker?._id && <button className='bg-gray-900 text-white rounded-md px-4 py-1.5 text-xs'>Add a Review</button>}
                            {request?.reviews?.length > 0 && <div className='w-full h-56 my-4 custom-scrollbar overflow-y-scroll flex flex-col gap-3'>
                                {
                                    request?.reviews?.map((review:Review) => (
                                        <div key={review?._id} className='w-full flex flex-col gap-3 items-start py-3 border-b border-gray-300 '>
                                            <div className='w-full flex flex-col gap-2'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-8 h-8  rounded-full'>
                                                        <Image className='rounded-full w-8 h-8' loader={azureLoader} src={review?.postedBy?.profileImage?.url || "/assets/images/placeholder_user.jpg"} width={24} height={24} alt='Seeker Image' />
                                                    </div>
                                                    <h6 className="h6">{review?.postedBy?.fullName?.first} {review?.postedBy?.fullName?.last}</h6>
                                                </div>
                                                <p className='body-2'>{review?.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>}
                        </div>
    
                        {!request?.reviews?.length  && <p className='body-2 px-3 text-gray-500'>No reviews yet.</p>}
    
                    </div>
                </div>
    
                <div className='md:col-span-4 col-span-12  flex flex-col gap-5 p-3'>
                    {/* <div className='w-full bg-white rounded-md py-3 px-4 gap-4 shadow-md flex flex-col'>
                        <div className='w-full border-b border-gray-300 pb-4 flex flex-col gap-2'>
                            <span className='text-start text-gray-600 text-base'>request Charge</span>
                            <h6 className="h2">₹{request?.geek?.rateCard}</h6>
                        </div>
    
                        <div className='w-full'>
                            <button className='w-full rounded text-white bg-[#ff008a] px-4 py-2'>
                                   Request request
                            </button>
                        </div>
                    </div>  */}
    
    
                    <div className='w-full bg-white rounded-md py-3 px-4 gap-4 shadow-md flex flex-col'>
                        <div className='w-full border-b border-gray-300 pb-4 flex flex-col gap-2'>
                            <h3 className="text-2xl font-bold">Seeker Details</h3>
                        </div>
    
                        {/* Profile Section */}
{request?.seeker?._id ? (
  <div className='w-full flex flex-col gap-3'>
    <div className="bg-gray-200/60 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-3 h-36 gap-2">
    
    {/* Avatar */}
    <div className="w-20 h-20 rounded-full overflow-hidden">
      <img
        src={
          request?.seeker?.profileImage
            ? request.seeker.profileImage
            : "/assets/photos/placeholder_user.jpg"
        }
        alt="Seeker profile"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Name */}
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold dark:text-gray-100 text-xl text-center">
        {request?.seeker?.fullName?.first}{" "}
        {request?.seeker?.fullName?.last}
      </p>
    </div>
  </div>

 
    <div className='flex flex-col gap-2 mt-4 pb-4'>
        <div className="flex items-center justify-between gap-2">
        <h4 className="text-base text-gray-800 dark:text-gray-100">Email:</h4>
        {request?.seeker?.email ? <p className="dark:text-gray-100">{request?.seeker?.email}</p> : <p className="dark:text-gray-100">N/A</p>}
    </div>
    <div className="flex items-center justify-between gap-2">
        <h4 className="text-base text-gray-800 dark:text-gray-100">Phone:</h4>
        {request?.seeker?.phone ? <p className="dark:text-gray-100">{request?.seeker?.phone}</p> : <p className="dark:text-gray-100">N/A</p>}
    </div>
    <div className="flex items-center justify-between gap-2">
        <h4 className="text-base text-gray-800 dark:text-gray-100">Address:</h4>
        {request?.seeker?.address?.city && request?.seeker?.address?.state ? <p className="dark:text-gray-100">{request?.seeker?.address?.city}, {request?.seeker?.address?.state}</p> : <p className="dark:text-gray-100">N/A</p>}
    </div>
    </div>
  </div>

  
) : (
  <p className="w-full text-center dark:text-white">
    Seeker does not exist
  </p>
)}

    
                        
                    </div>  

                    {curGeek?._id === request?.geek?._id && request?.status !== "Completed" && request?.status !== "Cancelled" && request?.status !== "Rejected" && (
                      <div className='w-full bg-white rounded-md py-3 px-4 gap-4 shadow-md flex flex-col'>
                        <button onClick={()=>{setUploadedMedia(true)}} className='w-full cursor-pointer bg-teal-500 text-white text-sm rounded-md px-3 py-2'>Complete Request</button>
                    </div>
                  )}   
                </div>
            </div>
</section>
  );
};

export default SingleRequestPage;
