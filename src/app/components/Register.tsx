"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import {getOtp} from "../../features/seeker/seekerSlice"
import { useAppDispatch } from '@/lib/hooks'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import { url } from '@/utils/url'
import { getCategories } from '@/features/category/categorySlice';
import {  sendGeekOTP } from '@/features/geek/geekSlice';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import Brand from '@/interfaces/Brand';
import { getBrandsByCategory } from '@/features/brands/brandsSlice';
import { Multiselect } from 'react-widgets/cjs';
import "react-widgets/styles.css";

const Register = () => {
    
    const query = useSearchParams();
    const type = query.get('type');
    
    const [selected, setSelected] = useState<'Seeker' | 'Geek' | ''>('');
    const dispatch = useAppDispatch()
   const getValidationSchema = (selected: string) =>
     Yup.object({
        firstName: Yup.string()
        .required("First Name is required")
        .min(3, "Minimum 3 letters")
        .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed"),
        lastName: Yup.string()
        .required("Last Name is required")
        .min(3, "Minimum 3 letters")
        .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed")
        ,
        phone: Yup.string()
        .required("Phone is Required")
        .length(10, "Phone number must be 10 digits"),
        category: Yup.string().when([], {
        is: () => selected === 'Geek',
        then: (schema) => schema.required("Category is required"),
        otherwise: (schema) => schema.notRequired(),
        }),
        yoe: Yup.number().when([], {
        is: () => selected === 'Geek',
        then: (schema) => schema.required("Year of Experience is required").min(0, "Cannot be less than 0").max(60, "Cannot be more than 60"),
        otherwise: (schema) => schema.notRequired(),
        }),
        refCode: Yup.string(),
        brands: Yup.array().when([], {
            is: () => selected === 'Geek',
            then: (schema) => schema.required("Brands are required"),
            otherwise: (schema) => schema.notRequired(),
        })
    });

  interface FormData {
    refCode: string;
    firstName: string;
    lastName: string;
    phone: string;
    category: string;
    yoe: number;
    brands: Brand[]
  }



    const initialValues:FormData = {
        firstName:"",
        lastName:"",
        phone:"",
        category:"",
        refCode:"",
        yoe:0,
        brands:[]
    }

    interface Category {
        _id: string;
        title: string;
        slug: string;
        subCategories: Array<object>;
    }


    const formik = useFormik({
        initialValues,
        validationSchema: getValidationSchema(selected),
        onSubmit: async values => {
            if(selected === 'Seeker') dispatch(getOtp(values.phone));
            else dispatch(sendGeekOTP(values.phone));
          },

    })

    const seekerState = useSelector((state:RootState)=>{return state.seeker})

    const geekState = useSelector((state:RootState)=>{return state.geek})
    
    
useEffect(() => {
  if (seekerState?.isSuccess && seekerState?.isOTPSent || geekState?.isSuccess && geekState?.isOTPSent) {
    const { firstName, lastName, phone, category, yoe } = formik.values;
    if(selected === "Seeker"){
        if(firstName !=="" && lastName !=="" && phone !==""){
            const query = `?phone=${phone}&firstName=${firstName}&lastName=${lastName}&refCode=${formik.values.refCode}`;
            window.location.href = `/verify-otp${query}&context=register&selected=${selected}`;
    }
    }
    else{
        if(firstName !=="" && lastName !=="" && phone !=="" && category !=="" && yoe !==0 && formik.values.brands.length !==0){
            const brands = formik.values.brands.map((brand:Brand) => brand._id);
            const query = `?phone=${phone}&firstName=${firstName}&lastName=${lastName}&category=${category}&yoe=${yoe}&refCode=${formik.values.refCode}&brands=${JSON.stringify(brands)}`;
            window.location.href = `/verify-otp${query}&context=register&selected=${selected}`;
        }
    }
  }
}, [seekerState?.isSuccess, geekState?.isSuccess, formik.values, selected, seekerState?.isOTPSent, geekState?.isOTPSent]);

    

useEffect(() => {
  if (selected === 'Geek') {
    // Clear brands whenever category changes
    formik.setFieldValue('brands', []);
  }
}, [formik.values.category]);
 

    const handleGoogleLogin = () => {
        window.location.href = `${url}seeker/google`;
    };

    const handleMSLogin = () => {
        window.location.href = `${url}seeker/microsoft`;
    };


console.log(formik.values.brands);

// Handle redirect if already authenticated
useEffect(() => {
  if (seekerState?.isAuthenticated || geekState?.isAuthenticated) {
    toast.error('You are already logged in.');
    window.location.href = '/';
  }
}, [seekerState, geekState,selected]);

// Fetch categories when 'Geek' is selected
useEffect(() => {
    if(type === 'geek' && selected !== 'Seeker'){
        setSelected('Geek');
    }
    if (selected === 'Geek') {
        dispatch(getCategories());
    }
    if(selected === '' && type !== 'geek'){
        setSelected('Seeker');
    }
}, [selected, dispatch, type]);


useEffect(()=>{

    if(formik.values.category !== '' && selected === 'Geek'){
        dispatch(getBrandsByCategory(formik.values.category));
    }

},[formik.values.category, selected, dispatch])


const brandsByCategory = useSelector((state: RootState) => state.brand.brandsByCategory?.brands) as Brand[];

const allBrands = brandsByCategory?.map((brand) => {return {name:brand.name, _id:brand._id}})



            

    const categories: Category[] = useSelector((state: RootState) => state.category.categories as Category[]);
            

  return (
    <section className='w-full flex flex-col justify-center items-center'>
            <div className='w-full relative breadcrumb-bg-2'>
                <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                    <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                        <div className='flex flex-wrap w-full'>
                            <div className='w-full flex flex-col gap-3 items-center justify-center'>
                                <h2 className='text-4xl font-bold text-black'>Register</h2>
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
                                <p className=' text-gray-600'>Register</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>



            <div className='py-20 px-3 w-full flex  items-center justify-center'>
                <div className='w-sm mx-auto gap-8 flex flex-col items-center justify-center'>
                    <div className='w-full flex items-center justify-between'>
                        <Link href="/login/geek" className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-600'>Login as Geek?</Link>
                        <Link href="/login/seeker" className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-600'>Login as Seeker?</Link>
                    </div>
                    {selected === 'Seeker' && <div className='flex items-center justify-center gap-2'>
                        <button onClick={handleGoogleLogin} className='w-full flex items-center justify-start'>
                            <Image src="/google_SI_light.svg" width={155} height={155} alt="Sign In with Google" />
                        </button>

                        <button onClick={handleMSLogin} className='w-full flex items-center justify-start'>
                            <Image src="/ms_signin_light.svg" width={205} height={205} alt="Sign In with Microsoft" />
                        </button>
                    </div>}

                    <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-4'>
                    <div className="flex gap-6 items-center w-full mb-3">
                        <label className="flex items-center cursor-pointer gap-2">
                            <input
                            type="radio"
                            name="userType"
                            value="Geek"
                            checked={selected === 'Geek'}
                            onChange={() => setSelected('Geek')}
                            className="accent-teal-500  w-3 h-3"
                            />
                            <span className="text-gray-500">Geek</span>
                        </label>

                        <label className="flex items-center cursor-pointer gap-2">
                            <input
                            type="radio"
                            name="userType"
                            value="Seeker"
                            checked={selected === 'Seeker'}
                            onChange={() => setSelected('Seeker')}
                            className="accent-teal-500 w-3 h-3"
                            />
                            <span className="text-gray-500">Seeker</span>
                        </label>
                        </div>

                         <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="refCode" className=' text-gray-800 px-1'>Refferal Code</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter Refferal Code"
                                required={true}
                                name="refCode"
                                onChange={formik.handleChange}
                                value={formik.values.refCode}
                                type="text"
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>
                            <div>
                                    {formik.touched.refCode && formik.errors.refCode ? (
                                        <div><p className='text-sm text-red-400 text-danger'>{formik.errors.refCode}</p></div>
                                    ) : null}
                                </div>
                        </div>


                    <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="firstName" className=' text-gray-800 px-1'>First Name</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter your First Name"
                                required={true}
                                name="firstName"
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                type="text"
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>
                            <div>
                                    {formik.touched.firstName && formik.errors.firstName ? (
                                        <div><p className='text-sm text-red-400 text-danger'>{formik.errors.firstName}</p></div>
                                    ) : null}
                                </div>
                        </div>


                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="lastName" className=' text-gray-800 px-1'>Last Name</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter your Last Name"
                                required={true}
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                type="text"
                                title=""
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>
                            <div>
                                    {formik.touched.lastName && formik.errors.lastName ? (
                                        <div><p className='text-sm text-red-400 text-danger'>{formik.errors.lastName}</p></div>
                                    ) : null}
                                </div>
                        </div>

                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="phone" className=' text-gray-800 px-1'>Phone</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter your Phone Number"
                                required={true}
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                type="text"
                                title=""
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>

                            <div>
                                    {formik.touched.phone && formik.errors.phone ? (
                                        <div><p className='text-sm text-red-400 text-danger'>{formik.errors.phone}</p></div>
                                    ) : null}
                                </div>

                        </div>

                        {/* <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="email" className=' text-gray-800 px-1'>Password</label>
                            <div className="relative  w-full bg-[#f6f6f6]  rounded-sm">
                                <input 
                                placeholder="Enter your password"
                                required={true}
                                name="password"
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
                        </div> */}


                        {selected === 'Geek' && <>
                        
                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="category" className=' text-gray-800 px-1'>Your primary Skill</label>
                            <select 
                                onChange={formik.handleChange} 
                                value={formik.values.category} 
                                name="category" 
                                className='text-gray-500 text-sm outline-none bg-[#f6f6f6] py-3 px-2 rounded-sm' id="">
                                <option className='text-gray-500 text-sm' value="" >Select Category</option>
                                {categories?.map((c) => (<option className='text-gray-500 text-sm' key={c._id} value={c._id} >{c.title}</option>))}   
                            </select>
                            {formik.touched.category && formik.errors.category ? (
                                <p className='text-sm text-red-400'>{formik.errors.category}</p>
                            ) : null}
                        </div>


                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="category" className=' text-gray-800 px-1'>Select Brands</label>

                            <Multiselect
                                data={allBrands}
                                dataKey="_id"
                                textField="name"
                                value={formik.values.brands?.map((b) => b._id)}
                                onChange={(value) => formik.setFieldValue("brands", value)}
                                placeholder="Select Brands"
                                />
                                {formik.touched.brands && formik.errors.brands && (
                                <div>
                                    {Array.isArray(formik.errors.brands) && formik.errors.brands.map((error, index) => (
                                        <p key={index} className="text-sm text-red-500">
                                            {error.toString()}
                                        </p>
                                    ))}
                                </div>
                            )}
                            
                        </div>




                        
                        <div className='w-full flex flex-col gap-3'>
                            <label htmlFor="yoe" className=' text-gray-800 px-1'>Years of Experience</label>
                            <div className="relative  w-full dark:bg-gray-950">
                                <input 
                                placeholder="Enter your Years of Experience"
                                name="yoe"
                                value={formik.values.yoe}
                                onChange={formik.handleChange}
                                type="number"
                                id="yoe"
                                title=""
                                className="block px-3.5 pb-3.5 pt-3.5 w-full text-sm text-gray-950 outline-none dark:text-white  bg-[#f6f6f6]  rounded-sm   appearance-none  peer" 
                                >
                                </input>

                            </div>

                            <div>
                                    {formik.touched.yoe && formik.errors.yoe ? (
                                        <div><p className='text-sm text-red-400 text-danger'>{formik.errors.yoe}</p></div>
                                    ) : null}
                                </div>

                            
                        </div>

                        </>
                        }

                        

                        <button type='submit' disabled={formik.isSubmitting} className='btn-primary'>
                            Sign Up
                        </button>
                    </form>
                </div>

            </div>
    </section>
  )
}

export default Register
