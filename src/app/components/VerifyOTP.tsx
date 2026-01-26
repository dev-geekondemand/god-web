"use client";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createGeek } from '@/features/geek/geekSlice';
import { getLoginOTP, loadUser, loginWithOTP, registerUser } from '@/features/seeker/seekerSlice';
import { useAppDispatch } from '@/lib/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';

const VerifyOTP = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const mobile = searchParams.get('phone');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const category = searchParams.get('category');
  const yoe = searchParams.get('yoe');
  const selected = searchParams.get('selected');
  const context = searchParams.get('context');
  const refCode = searchParams.get('refCode');
  const brands = searchParams.get('brands');

  console.log(brands);
  


    useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  

  const [step,] = useState<'register' | 'login'>(context === 'login' ? 'login' : 'register');

  const validationSchema = Yup.object({
    otp: Yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
  });

  const formik = useFormik({
    initialValues: { otp: '' },
    validationSchema,
    onSubmit: () => {
      setLoading(true);
      try{
          const loginPayload = { 
          phone: mobile ?? '',
          otp: +formik.values.otp,
        };

        const fullName = {
          first: firstName ?? '',
          last: lastName ?? '',
        };

        if (step === 'register' && selected === 'Seeker') {
          dispatch(registerUser({ phone: mobile ?? '', otp: +formik.values.otp, fullName, refCode: refCode ?? '' }));
        } else if (step === 'register' && selected === 'Geek') {
          dispatch(createGeek({
            fullName: {
              first: firstName ?? '',
              last: lastName ?? '',
            },
            mobile: mobile ?? '',
            otp: +formik.values.otp,
            primarySkill: category ?? '',
            yoe: Number(yoe),
            type:"Individual",
            refCode: refCode ?? '',
            brandsServiced: brands ? JSON.parse(brands) : []
          }));
        } else {
          dispatch(loginWithOTP(loginPayload));
        }
      }catch(error){
        toast.error('An error occurred. Please try again.');
        console.log(error);
      }finally{
        setLoading(false);
      }

      setTimeout(() => {
        dispatch(loadUser());
      }, 600);
    },
  });

  const userState = useSelector((state: RootState) => state.seeker);


  useEffect(() => {
    if (userState.isAuthenticated)  {
        toast.dismiss();
        toast.success('Login successful');
      setTimeout(() => {
          window.location.href = '/';
      },1000)
    }
  }, [userState.isAuthenticated]);



   const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      setTimer(30);
      dispatch(getLoginOTP(mobile ?? ''));
      toast.success("OTP resent!");
    } catch {
      toast.error("Error resending OTP");
    }
  };

  return (
    <section className='w-full flex flex-col min-h-screen justify-center items-center'>

            <div className='py-20 w-full flex  items-center justify-center'>
                <div className='w-sm mx-auto flex flex-col items-center justify-center'>
                    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-6'>
                      

                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="email" className=' text-gray-800 px-1'>Enter the 6-digit OTP sent to{" "}
                            <span className="font-medium text-gray-800">+91********{mobile?.slice(-2)}</span></label>
                            <div className="relative  w-full bg-[#f6f6f6]  rounded-sm">
                                <input 
                                placeholder="Enter your otp"
                                required={true}
                                name="otp"
                                onChange={formik.handleChange}
                                value={formik.values.otp}
                                type={viewPassword ? 'text' : 'password'}
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white      appearance-none  peer" 
                                >
                                </input>

                                <button type='button' onClick={()=>setViewPassword(!viewPassword)} className='absolute cursor-pointer w-5 h-5 right-3.5 top-3.5'>
                                    {!viewPassword ? <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                            d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                                            stroke="#797979"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            />
                                            <path
                                            d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                                            stroke="#797979"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            />
                                        </g>
                                        </svg> : <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                >
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                    d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                                                    stroke="#797979"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    />
                                                </g>
                                                </svg>
                                        }

                                </button>
                            </div>
                            <div>
                                    {formik.touched.otp && formik.errors.otp ? (
                                        <div><p className='text-sm text-red-400 text-danger'>{formik.errors.otp}</p></div>
                                    ) : null}
                                </div>
                                 <div className=" items-center">
                          <button
                            disabled={timer > 0}
                            onClick={handleResendOTP}
                          >
                            <p
                              className={`${
                                timer > 0 ? "text-teal-600" : "text-teal-600 cursor-pointer"
                              } text-base underline`}
                            >
                              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                            </p>
                          </button>
                        </div>
                        </div>

                       

                       
                       <button type="submit" className="w-full cursor-pointer text-white bg-teal-600 hover:bg-teal-700  font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex justify-center items-center">
                                                      {loading ? (
                                                       
                                                           <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                                                       
                                                   ) : (
                                                       <span>Verify OTP</span>
                                                   )}
                                                   </button>
                    </form>
                </div>

            </div>
    </section>
  )
}

export default VerifyOTP
