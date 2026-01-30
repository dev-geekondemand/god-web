"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import CustomInput from '../components/CustonInput'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { createEnquiry, resetEnquiryState } from '@/features/enquiry/enquirySlice'
import { useAppDispatch } from '@/lib/hooks'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import toast from 'react-hot-toast'
import { Mail, MapPin, Phone } from 'lucide-react'


const Contact = () => {

  const dispatch = useAppDispatch();



  const formik =useFormik({
    initialValues:{
      name:'',
      email:'',
      message:'',
      phone:''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
      message: Yup.string().required('Message is required').min(20, 'Message must be at least 20 characters long')
    }),
    onSubmit:(values)=>{
      const enquiryData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message
      }   
      dispatch(createEnquiry(enquiryData));
      formik.resetForm();
    }
  })

  const enquiryState = useSelector((state:RootState) => state.enquiry);

  useEffect(() => {
    if (enquiryState.isEnquiryCreated) {
      toast.success('Enquiry submitted successfully!');
    }
    if(enquiryState?.isError){
      toast.error(`Failed to submit enquiry: ${enquiryState.message}`);
    }

    dispatch(resetEnquiryState());
  }, [enquiryState, dispatch]);


  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <div className='w-full relative breadcrumb-bg-2'>
        <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#e3e3e3]'>
            <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                <div className='flex flex-wrap w-full'>
                    <div className='w-full flex flex-col gap-3 items-center justify-center'>
                        <h2 className='text-4xl font-bold text-black'>Contact Us</h2>
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
                          <p className=' text-gray-600'>Contact Us</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      
    </div>

    <div className='w-full justify-center flex py-2'>
        <div className='max-w-7xl mx-auto  grid md:grid-cols-3 grid-cols-1 w-full p-3 gap-8 '>
            <div className='bg-white hover:shadow-lg hover:shadow-purple-100 px-6 py-4 flex items-center gap-6 border border-gray-200 rounded-md'>
                <div className='rounded-full w-20 h-20 bg-gray-50 flex justify-center items-center'>
                    <Phone className='w-8 h-8 text-teal-600' />
                </div>
                <div className='flex flex-col gap-1'>
                    <h6 className='text-lg text-black '>Phone</h6>
                    <a href='tel:(+91) 8374374117' className='body-2 text-gray-600'>(+91) 8374374117</a>
                    {/* <p className='body-2 text-gray-600'>(123) 456-7890</p> */}
                </div>
            </div>

            <div className='bg-white hover:shadow-lg hover:shadow-purple-100 px-6 py-4 flex items-center gap-6 border border-gray-200 rounded-md'>
                <div className='rounded-full w-20 h-20 bg-gray-50 flex justify-center items-center'>
                    <Mail className='w-8 h-8 text-teal-600' />
                </div>
                <div className='flex flex-col gap-1'>
                    <h6 className='text-lg text-black '>Email Address</h6>
                    {/* <p className='body-2 text-gray-600'>abhaypratap@example.com</p> */}
                    <a href='mailto:hello@geekondemand.in' className='body-2 text-gray-600'>hello@geekondemand.in</a>
                </div>
            </div>

            <div className='bg-white hover:shadow-lg hover:shadow-purple-100 px-6 py-4 flex items-center gap-6 border border-gray-200 rounded-md'>
                <div className='rounded-full w-20 h-20 bg-gray-50 flex justify-center items-center'>
                    <MapPin className='w-8 h-8 text-teal-600' />
                </div>
                <div className='flex flex-col gap-1 '>
                    <h6 className='text-lg text-black '>Address</h6>
                    <p className='text-xs md:text-sm text-gray-600'>Level 1, Suite # 11, Tourism Plaza,</p>
                    <p className='text-xs md:text-sm text-gray-600'> Begumpet, Greenland&apos;s-Hyderabad.</p>
                    <p className='text-xs md:text-sm text-gray-600'>Telangana-India-500016.</p>
                </div>
            </div>
            
        </div>
    </div>


    <div className="w-full py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl md:gap-12 gap-8 mx-auto grid grid-cols-1 md:grid-cols-2 w-full items-center justify-between">
        {/* Image Section */}
        <div className=" h-[90%] w-full rounded-lg flex relative bg-gray-100 justify-center">
          <Image
            src="/assets/images/contact.jpeg"
            alt="Contact Illustration"
            layout='fill'
          />
        </div>
        {/* Form Section */}
        <div className="w-full mb-8 p-8">
          <div className='flex flex-col gap-2 mb-8'>
          <h2 className="text-4xl font-bold text-start text-gray-900">Get In Touch</h2>
          <p className='body-2 text-gray-600'>Send us a message and we&apos;ll get back to you as soon as possible.</p>
          </div>
          <form onSubmit={formik.handleSubmit} action="#" method="POST" className="space-y-8">
            <CustomInput 
                onChange={formik.handleChange}
                readOnly={false}
                disabled={false}
                value={formik.values.name}
                name="name"
                labelFor="name"
                title="Name"
                required={true}
                type="text"
                labelBg="bg-white" placeholder={''}            />
                {formik.errors.name && formik.touched.name && <div className="text-red-500">{formik.errors.name}</div>}

          <div className='w-full flex gap-6 items-center'>
          <CustomInput 
                   onChange={(formik.handleChange)}
                readOnly={false}
                disabled={false}
                  value={formik.values.email}
                  name="email"
                  labelFor="email"
                  title="Email"
                  required={true}
                  type="text"
                  labelBg="bg-white" placeholder={''}            />
                  {formik.errors.email && formik.touched.email && <div className="text-red-500">{formik.errors.email}</div>}

            <CustomInput 
                   onChange={(formik.handleChange)}
                readOnly={false}
                disabled={false}
                  value={formik.values.phone}
                  name="phone"
                  labelFor="phone"
                  title="Phone"
                  required={true}
                  type="text"
                  labelBg="bg-white" placeholder={''}            />
                  {formik.errors.phone && formik.touched.phone && <div className="text-red-500">{formik.errors.phone}</div>}
          </div>

          <div className="relative w-full dark:bg-gray-950">
                <textarea 
                id="message"
                name="message"
                onChange={formik.handleChange}
                value={formik.values.message}
                rows={4}
                required
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-950 outline-none dark:text-white border bg-transparent rounded-lg  border-gray-300 appearance-none  peer" placeholder=" "
                >
                </textarea>
                <label htmlFor="message" className={`absolute text-sm text-gray-500 dark:text-gray-100 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] dark:bg-gray-950 bg-white  px-2 peer-focus:px-2 peer-focus:bg-white dark:peer-focus:bg-black peer-focus:text-black dark:peer-focus:text-white font-normal peer-focus:font-semibold  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-4`}>Message</label>
                {formik.touched.message && formik.errors.message && <div className="text-red-500 text-xs">{formik.errors.message}</div>}
            </div>

            

            <div className='w-full justify-start flex items-center'>
              <button
                type="submit"
                className="w-fit p-4 transform transition duration-200 cursor-pointer bg-teal-600 text-white font-normal text-sm rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>

    <div className='w-full h-76'>
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7613.062809198951!2d78.45031897684623!3d17.43426165883295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1742643646617!5m2!1sen!2sus" width={'100%'} height={"100%"}   loading="lazy" ></iframe>
    </div>
    </section>
  )
}

export default Contact
