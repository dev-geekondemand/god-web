"use client"
import Image from 'next/image'
import { useEffect } from 'react'
import PageBanner from '@/app/components/PageBanner'
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
      <PageBanner title="Contact Us" crumbs={[{ label: 'Contact Us' }]} />

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
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
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
      <iframe src="https://maps.google.com/maps?q=Geekondemand+Office,+Greenland%27s+Tourism+Plaza,+Begumpet,+Hyderabad,+Telangana+500016&output=embed&z=17" width={'100%'} height={"100%"} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
    </section>
  )
}

export default Contact
