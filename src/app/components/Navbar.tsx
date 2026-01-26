"use client";

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';
import React, {  useState } from 'react'
import CustomButton from './CustomButton';
import Link from 'next/link';
import {  useSelector } from 'react-redux';
import {  logoutUser, UserState } from '@/features/seeker/seekerSlice';
import CustomModel from './CustomModal';
import {  GeekInitialState, logoutGeek } from '@/features/geek/geekSlice';
import { LayoutGrid, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RootState } from '@/lib/store';
import { useAppDispatch } from '@/lib/hooks';
import { ServiceRequest } from '@/interfaces/ServiceRequest';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();




  const { isAuthenticated, user } = useSelector((state:RootState) => state.seeker) as UserState;
  const geekState = useSelector((state:RootState) => state.geek) as GeekInitialState;
  const isGeekAuthenticated = geekState?.isAuthenticated;
  const geek = geekState?.geek;



  const navlinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 5, name: "Blogs", link: "/blogs" },
    { id: 4, name: "Geeks", link: "/geeks" },
    { id: 3, name: "About", link: "/about" },
    { id: 2, name: "Contact Us", link: "/contact" },
  ];

  const handleLogout = () => {
    const userType = localStorage.getItem("userType");
    if(userType === "seeker") {
      dispatch(logoutUser());
      localStorage.removeItem("userType");
    } else {
      dispatch(logoutGeek());
      localStorage.removeItem("userType");
    }
    setOpenModal(false);
    setSidebarOpen(false);
  };

  return (
    <>
      <div className='sticky top-0 z-50 w-full h-16 bg-white shadow-sm flex px-4 py-2'>
        <div className='w-full h-full flex justify-between items-center px-3 py-1.5'>

          {/* Left: Logo & Categories */}
          <div className='flex h-full items-center lg:justify-center justify-start w-full'>
            <div className='flex gap-6 items-center justify-center'>
              <Image src="/assets/logo-big.webp" width={120} height={16} alt='Geek on Demand logo' />
              <button onClick={() => { router.push("/service-categories") }} className='lg:flex hidden cursor-pointer font-medium text-gray-700 items-center gap-2 bg-gray-100 px-5 border border-gray-200 py-1.5 rounded-md text-sm text-nowrap'>
                <LayoutGrid className='w-4 h-4 text-gray-500' />
                
                Categories
              </button>
            </div>
          </div>

          {/* Center: Navlinks */}
          <div className='w-full hidden h-full lg:flex items-center justify-center gap-10 text-sm'>
            {navlinks.map((navlink) => (
              <div key={navlink.id} className='text-black text-nowrap'>
                <a className={`${pathname === navlink.link ? "text-teal-600 font-semibold h-full" : "hover:text-teal-600 hover:underline font-medium underline-offset-8"}`} href={navlink.link}>
                  {navlink.name}
                </a>
              </div>
            ))}
          </div>

          {/* Right: Auth & Join */}
          <div className='lg:flex hidden w-full items-center justify-center gap-6'>
            {(!user?.authProvider && !geekState.geek) || (!isAuthenticated && !isGeekAuthenticated) ? (
              <Link href={"/login"} className='flex items-center justify-center bg-gray-200 px-4 py-2 rounded-lg text-sm text-nowrap'>
                Sign In
              </Link>
            ) : (
              <div className='text-sm flex gap-2 items-center'>
                Welcome,&nbsp;
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex cursor-pointer items-center gap-2 focus:outline-none'>
                    <div className='flex items-center gap-2'>
                      {user?.fullName?.first || geekState.geek?.fullName?.first}
                    <UserRound className='w-5 h-5 mb-1 text-gray-800' />
                    </div>
                    {isGeekAuthenticated && geek?.requests && Array.isArray(geek.requests) && (
                      <p onClick={()=>{router.push(`/geeks/${geek?._id}/requests`)}}> 
                        <span>
                          {(geek.requests as ServiceRequest[]).filter((request:ServiceRequest) => request.geekResponseStatus === "Pending").length > 0 && (
                            <span className=' text-white bg-red-500 py-0.5 px-1.5 rounded-full'>
                              {(geek.requests as ServiceRequest[]).filter((request:ServiceRequest) => request.geekResponseStatus === "Pending").length}
                            </span>
                          )}
                        </span>
                      </p>
                    )}
                    {/* {isGeekAuthenticated && <p onClick={()=>{router.push(`/geeks/${geek?._id}/requests`)}}> <span>{geek?.requests && geek?.requests?.filter((request:ServiceRequest) => request.geekResponseStatus === "Pending").length > 0 && <span className=' text-white bg-red-500 py-0.5 px-1.5 rounded-full'>{geek?.requests?.filter((request:ServiceRequest) => request.geekResponseStatus === "Pending").length}</span>}</span></p>} */}

                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-48 mt-2'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isGeekAuthenticated && <DropdownMenuItem><Link  href={`/geeks/dashboard`}>My Profile</Link></DropdownMenuItem>}
                    {isGeekAuthenticated && <DropdownMenuItem onClick={()=>{router.push(`/geeks/${geek?._id}/requests`)}}>Notifications <span>{geek?.requests && geek?.requests?.filter((request:ServiceRequest) => request.geekResponseStatus === "Pending").length > 0 && <span className=' text-white bg-red-500 py-0.5 px-1.5 rounded-full'>{geek?.requests?.filter((request:ServiceRequest) => request.geekResponseStatus === "Pending").length}</span>}</span></DropdownMenuItem>}
                    {isAuthenticated && <DropdownMenuItem><Link  href={`/seeker/${user?._id}`}>My Profile</Link></DropdownMenuItem>}
                    {/* {isGeekAuthenticated && <DropdownMenuItem onClick={()=>{router.push(`/geeks/${geek?._id}/services`)}}>My Services</DropdownMenuItem>} */}
                    {isAuthenticated && <DropdownMenuItem onClick={()=>{router.push(`/seeker/${user?._id}/services`)}}>My Services</DropdownMenuItem>}
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                      <CustomModel
                        text={"Logout"}
                        title={"Are you sure you want to Logout?"}
                        description='You will be logged out of your account.'
                        onCancel={() => setOpenModal(false)}
                        onOk={handleLogout}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        toggleModal={() => setOpenModal(!openModal)}
                        isOpen={openModal}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {!isGeekAuthenticated &&<CustomButton handleClick={() => { 
              if(!isAuthenticated && !isGeekAuthenticated){
                router.push("/register?type=geek")
              }else{
                toast.error("Please logout first to register as a Geek.",{position: 'top-center' });
              }
             }} text={"Become a Geek"} type={"submit"} width='text-sm w-fit' />}
          </div>

          {/* Mobile: Hamburger */}
          <div className='flex lg:hidden'>
            <button onClick={() => setSidebarOpen(true)}>
              <Image src={"/assets/icons/hamburger-menu.svg"} width={24} height={14} alt='menu' />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-white opacity-50 z-50 transition-opacity duration-300"></div>
      )}

      {/* Sidebar (Right slide-in) */}
      <div className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='p-4 flex justify-between items-center border-b'>
          <Image src="/assets/logo-big.webp" width={100} height={16} alt='Logo' />
          <button onClick={() => setSidebarOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className='flex flex-col gap-4 p-4 text-sm'>
          {navlinks.map(nav => (
            <Link href={nav.link} key={nav.id} onClick={() => setSidebarOpen(false)} className={`text-black ${pathname === nav.link ? 'font-semibold text-blue-600' : ''}`}>
              {nav.name}
            </Link>
          ))}
          {(!user?.authProvider && !geekState.geek) || (!isAuthenticated && !isGeekAuthenticated) ? (
            <Link href="/login" onClick={() => setSidebarOpen(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-center">Sign In</Link>
          ) : (
            <>
              <p className='mt-4 font-semibold'>Welcome, {user?.fullName?.first || geekState.geek?.fullName?.first}</p>
              {isGeekAuthenticated && (
                <Link href="/geeks/dashboard" onClick={() => setSidebarOpen(false)}>My Profile</Link>
              )}
              {isAuthenticated && <Link  href={`/seeker/${user?._id}`}>My Profile</Link>}
                    {/* {isGeekAuthenticated && <DropdownMenuItem onClick={()=>{router.push(`/geeks/${geek?._id}/services`)}}>My Services</DropdownMenuItem>} */}
              {isAuthenticated && <button className='w-fit' onClick={()=>{router.push(`/seeker/${user?._id}/services`)}}>My Services</button>}

                  <CustomModel
                    text={"Logout"}
                    title={"Are you sure you want to Logout?"}
                    description='You will be logged out of your account.'
                    onCancel={() => setOpenModal(false)}
                    onOk={handleLogout}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    toggleModal={() => setOpenModal(!openModal)}
                    isOpen={openModal}
                  />
            </>
          )}
          {!isGeekAuthenticated &&<CustomButton handleClick={() => { 
              if(!isAuthenticated && !isGeekAuthenticated){
                router.push("/register?type=geek")
              }else{
                toast.error("Please logout first to register as a Geek.",{position: 'top-center' });
              }
             }} text={"Become a Geek"} type={"submit"} width='text-sm w-fit' />}
        </div>
      </div>
    </>
  );
};

export default Navbar;
