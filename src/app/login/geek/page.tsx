"use client"
import { loginGeek, sendGeekOTP } from '@/features/geek/geekSlice'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { useFormik } from 'formik'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

const LoginGeek = () => {

    const [isOTPSent, setIsOTPSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [otpPhone, setOtpPhone] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);


     useEffect(() => {
        setIsOTPSent(false);
    },[]);

    const dispatch = useAppDispatch();
   const validationSchema = React.useMemo(() => 
        Yup.object({
            phone: Yup.string()
            .required("Phone is Required")
            .length(10, "Phone number must be 10 digits"),
            otp: isOTPSent 
            ? Yup.string()
                .required("OTP is required")
                .length(6, "OTP must be 6 digits")
            : Yup.string().notRequired(),
        }), 
        [isOTPSent]);


   

    const formik = useFormik({
        initialValues: {
            phone:'',
            otp:'',
        },
        validationSchema: validationSchema,
        onSubmit: async () => {
           if(!isOTPSent){
                dispatch(sendGeekOTP(formik.values.phone));
           }else{
            dispatch(loginGeek({
                phone: formik.values.phone,
                otp: +formik.values.otp
            }));
            setIsOTPSent(false);
           }
        },
    });



    const geekState = useSelector((state: RootState) => {return state.geek});

useEffect(() => {
  if (geekState?.isAuthenticated) {
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } else if (geekState?.isOTPSent && !isOTPSent) {    
    setIsOTPSent(true);
    setOtpPhone(formik.values.phone); // 🔒 lock phone
    setResendTimer(30);
    setCanResend(false);
  }
}, [geekState, isOTPSent]);

useEffect(() => {
  if (isOTPSent && otpPhone && formik.values.phone !== otpPhone) {
    setIsOTPSent(false);
    setCanResend(false);
    setResendTimer(30);
    setOtpPhone(null);
  }
}, [formik.values.phone, isOTPSent, otpPhone]);

useEffect(() => {
  if (!isOTPSent || canResend) return;

  const interval = setInterval(() => {
    setResendTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setCanResend(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [isOTPSent, canResend]);


const handleResendOTP = async () => {
  if (!canResend || isResending) return;

  setIsResending(true);

  await dispatch(sendGeekOTP(formik.values.phone));

  toast.success("OTP resent");

  setResendTimer(30);
  setCanResend(false);
  setIsResending(false);
};



        
        // const handleGoogleLogin = () => {
        // window.location.href = `${url}seeker/google`;
        // };

        // const handleMSLogin = () => {
        // window.location.href = `${url}seeker/microsoft`;
        // };

  return (
    <section className='w-full flex flex-col justify-center items-center'>
            <div className='w-full relative breadcrumb-bg-2'>
                <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                    <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                        <div className='flex flex-wrap w-full'>
                            <div className='w-full flex flex-col gap-3 items-center justify-center'>
                                <h2 className='text-4xl font-bold text-black'>Geek Login</h2>
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

                                <Link href="/login" className='cursor-pointer'>
                                Login
                                </Link>

                                <svg fill="#000000" className='w-2 h-2' version="1.1" id="XMLID_287_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                    <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g>
                                </svg>
                                <p className=' text-gray-600'>Geek</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            
            </div>

            <div className='py-20 w-full flex  items-center justify-center'>
                <div className='w-sm mx-auto flex flex-col items-center gap-8 justify-center'>
                    <div className='w-full flex items-center justify-between'>
                        <Link href="/login/seeker" className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-600'>Login as Seeker Instead?</Link>
                        <Link href="/register?type=geek" className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-600'>Sign Up?</Link>
                    </div>
                    {/* <div className='flex items-center justify-center gap-2'>
                        <button onClick={handleGoogleLogin} className='w-full flex items-center justify-start'>
                            <Image src="/google_SI_light.svg" width={155} height={155} alt="Sign In with Google" />
                        </button>

                        <button onClick={handleMSLogin} className='w-full flex items-center justify-start'>
                            <Image src="/ms_signin_light.svg" width={205} height={205} alt="Sign In with Microsoft" />
                        </button>
                    </div> */}
                    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-6'>
                        
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


                        {isOTPSent && <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="otp" className=' text-gray-800 px-1'>OTP</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter your OTP"
                                required={true}
                                name="otp"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="otp"
                                title=""
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>

                            {formik.touched.otp && formik.errors.otp && (
                                <p className="text-red-500 text-xs">{formik.errors.otp}</p>
                            )}

                        </div>}

                        <button
                            type="submit"
                            disabled={isResending}
                            className={`btn-primary ${isResending ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                            {isResending ? 'Please wait…' : 'Sign In'}
                            </button>


                        {isOTPSent && (
                            <div className="flex justify-between items-center text-sm">
                                {!canResend ? (
                                <p className="text-gray-500">
                                    Resend OTP in <span className="font-semibold">{resendTimer}s</span>
                                </p>
                                ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className="text-teal-600 hover:underline font-medium disabled:opacity-50"
                                >
                                    Resend OTP
                                </button>
                                )}
                            </div>
                            )}


                    </form>
                </div>

            </div>
    </section>
  )
}

export default LoginGeek
