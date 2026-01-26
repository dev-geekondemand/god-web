"use client"
import { getLoginOTP, resetIsLoginOTP, } from '@/features/seeker/seekerSlice'
import Geek from '@/interfaces/Geek'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { url } from '@/utils/url'
import { useFormik } from 'formik'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

const Login = () => {

    const [loading, setLoading] = useState(false); // Generic loading for OTP/Verify

    useEffect(() => {
    dispatch(resetIsLoginOTP());
  }, []);


    const dispatch = useAppDispatch();
    const validationSchema = Yup.object({
        phone:Yup.string().required("Phone is Required").min(10,"Minimum 10 digits").max(10,"Maximum 10 digits"),
    })
    const formik = useFormik({
        initialValues: {
            phone:'',
        },
        validationSchema,
        onSubmit: async () => {
           
            setLoading(true);
            try{
                dispatch(getLoginOTP(formik.values.phone)).unwrap();                
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }
            
        },
    });

    const seekerState = useSelector((state: RootState) => {return state.seeker});
    const geekState = useSelector((state: RootState) => {return state.geek?.geek}) as Geek;

    useEffect(()=>{
        if(seekerState?.user?._id || geekState?._id){
            window.location.href = "/";
        }
    },[geekState?._id, seekerState?.user?._id])
    

    useEffect(() => {
        if(seekerState?.isLoginOTP && formik.values.phone !== '' && formik.isValid){
            setTimeout(() => {
              window.location.href = `/verify-otp?phone=${formik?.values?.phone}&context=login`;
            },3000)
        }

    }, [dispatch, seekerState?.isLoginOTP, formik.values.phone, formik.isValid]);
        
        const handleGoogleLogin = () => {
        window.location.href = `${url}seeker/google`;
        };

        const handleMSLogin = () => {
        window.location.href = `${url}seeker/microsoft`;
        };

  return (
    <section className='w-full flex flex-col justify-center items-center'>
            <div className='w-full relative breadcrumb-bg-2'>
                <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                    <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                        <div className='flex flex-wrap w-full'>
                            <div className='w-full flex flex-col gap-3 items-center justify-center'>
                                <h2 className='text-4xl font-bold text-black'>Seeker Login</h2>
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

                                <Link href="/login/geek" className='cursor-pointer'>
                                Login
                                </Link>

                                <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                    <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                                </svg>
                                <p className=' text-gray-600'>Seeker</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            
            </div>

            <div className='py-20 w-full flex  items-center justify-center'>
                <div className='w-sm mx-auto flex flex-col items-center gap-6 justify-center'>
                    <div className='w-full flex items-center justify-between'>
                        <Link href="/login/geek" className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-600'>Login as Geek?</Link>
                        <Link href="/register" className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-600'>Sign Up?</Link>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <button onClick={handleGoogleLogin} className='w-full flex items-center justify-start'>
                            <Image src="/google_SI_light.svg" width={155} height={155} alt="Sign In with Google" />
                        </button>

                        <button onClick={handleMSLogin} className='w-full flex items-center justify-start'>
                            <Image src="/ms_signin_light.svg" width={205} height={205} alt="Sign In with Microsoft" />
                        </button>
                    </div>
                    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-6'>
                        <div className='flex flex-col justify-center items-center'>
                            <p className='text-xl font-semibold text-gray-700'>Sign In with OTP</p>
                        </div>
                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="phone" className=' text-gray-800 px-1'>Mobile Number</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter your mobile number"
                                required={true}
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="phone"
                                title=""
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>

                            {formik.touched.phone && formik.errors.phone && (
                                <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                            )}

                        </div>


                       
                      
                            <button type="submit" className="w-full cursor-pointer text-white bg-teal-500 hover:bg-teal-500  font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex justify-center items-center">
                               {loading ? (
                                
                                    <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                                
                            ) : (
                                <span>Get OTP</span>
                            )}
                            </button>
                        
                    </form>
                </div>

            </div>
    </section>
  )
}

export default Login
