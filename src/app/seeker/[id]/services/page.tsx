"use client";
import { HoverCardComponent } from "@/app/components/HoverCard";
import {  getSeekerRequests, } from "@/features/request/requestSlice";
import { ServiceRequest } from "@/interfaces/ServiceRequest";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Requests = () => {

    const id = useSelector((state: RootState) => state.seeker?.user?._id);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
      dispatch(getSeekerRequests());
  }, [dispatch]);

  const requests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[];

  const azureLoader = ({ src }:{src:string}) => src;


 
const exisitingRequests = requests.filter((request) => request.geek?._id !== undefined && request.seeker?._id === id);





  return <section className="w-full h-full   flex flex-col items-center bg-gray-50 justify-center">
        <div className='w-full relative breadcrumb-bg-2'>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>My Services</h2>
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
                            <Link href={`/seeker/${id}`} className=' text-gray-600'>Profile</Link>

                            <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                            </svg>
                            <p className=' text-gray-600'>My Services</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    <div className="max-w-6xl w-full mx-auto  min-h-screen px-4 flex flex-col gap-4">
        <div className="w-full max-w-4xl mx-auto mt-6 space-y-4">
              {requests?.length > 0 && requests?.map((req) => (
                <div
                  key={req._id}
                  className={`p-8 rounded-xl border bg-white shadow-md transition duration-200 ${req?.geek?._id ? " " : "hidden"} ${
                    req.geekResponseStatus === "Pending" ? " border-teal-300" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex justify-center items-center">
                      <Image 
                        loader={azureLoader}
                        width={100}
                        height={100}
                        className="w-44 rounded-md"
                        src={req.category?.image?.url || "/assets/images/blogImg.jpg"}
                        alt="Service Image"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <h3 className="text-lg font-semibold">Service Request for {req?.category?.title}</h3>
                      <HoverCardComponent
                        linkText={req.geek instanceof Object ? "Geek: " + req.geek?.fullName?.first + " " + req.geek?.fullName?.last : ""}
                        avatarImg={req.geek instanceof Object ? req.geek.profileImage?.url : "/assets/images/placeholder_user.jpg"}
                        title={req.geek instanceof Object ? "Name: " + req?.geek?.fullName?.first + " " + req?.geek?.fullName?.last : ""}
                        line1={req?.geek?.mobile && req?.geekResponseStatus === "Accepted" ? "Mobile: " + req?.geek?.mobile : "Mobile: " + "+91**********"}
                        // line2={req.geek instanceof Object ? "Joined on: " + new Date(req?.geek?.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric'}):""}
                        mutedLine={req.geek instanceof Object ? req?.geek?.address?.city &&  "City: " + req?.geek?.address?.city : "" }
                      />
                      <p className="flex text-sm items-center gap-2 mt-1 text-gray-500">Status: <span className={`text-sm ${req.status === "Pending" || req.status === "Matched" ? "text-teal-600" : req.status === "Rejected" || req.status === "Cancelled" ? "text-red-500" : "text-green-500"}`}>{req.status}</span></p>
                    </div>
                    <div className="flex gap-4 justify-center items-center">
                     {(req?.geekResponseStatus === "Accepted" || req?.geekResponseStatus === "Completed" || req?.geekResponseStatus === "Pending") ? <button
                        onClick={()=>{router.push(`/seeker/${id}/services/${req._id}`)}}
                        className="bg-teal-500 text-white px-3 py-1.5 rounded-md hover:bg-teal-600 transition duration-200"
                      >
                        View
                      </button> : <span className={`${req?.geekResponseStatus === "Pending" || req?.geekResponseStatus === "Matched" ? "text-teal-600" : "text-red-500"}`}>
                        Request {req?.geekResponseStatus}
                        </span>}
                     
                    </div>
                  </div>
                </div>
              ))}
        
              {exisitingRequests?.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-6">No service requests found.</div>
              )}
            </div>
    </div>

  </section>
};

export default Requests;
