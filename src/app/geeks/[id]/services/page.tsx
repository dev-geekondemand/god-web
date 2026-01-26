'use client';
// import dynamic from 'next/dynamic';

// const Multiselect = dynamic(() => import('react-widgets/Multiselect'), {
//   ssr: false,
// });
import React, { useEffect, useState,  } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import CustomInput from '@/app/components/CustonInput';
import { useAppDispatch } from '@/lib/hooks';
import { getCategories } from '@/features/category/categorySlice';
import { getBrands, getBrandsByCategory } from '@/features/brands/brandsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
// import { Category } from '@/interfaces/Category';
import "react-widgets/styles.css";
import Brand from '@/interfaces/Brand';
import { createService, getServiceById, ServiceState } from '@/features/service/serviceSlice';
import toast from 'react-hot-toast';
import Geek from '@/interfaces/Geek';
import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/interfaces/Service';


interface ServiceFormValues {
  title: string;
  overviewDescription: string;
  price: number;
  category: string;
  brands: string[];
  tags: string[];
  benefits: string[];
  faqs: string[];
}

// interface BrandsByCategory {
//     category: Category;
//     count: number;
//     brands: Brand[];
// }

const ServiceCreateForm = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isEditing,setIsEditing] = useState(false);
    const [userType, setUserType] = useState('');

        useEffect(()=>{
        const user = localStorage.getItem('userType');
        if(user){
            setUserType(user);
        }
    },[])

    const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

    // const brandsState = useSelector((state: RootState) => state.brand?.brandsByCategory) as BrandsByCategory;
    // const brandsByCategory = brandsState?.brands as Brand[];
    // const categories = useSelector((state: RootState) => state.category?.categories) as Category[];
    const serviceState= useSelector((state: RootState) => state.service) as ServiceState;
    const serviceById = serviceState?.service as Service;

  const geek = useSelector((state: RootState) => state.geek?.geek) as Geek;

  const handleEditService = (service:Service)=>{
    dispatch(getServiceById(service._id));
    setIsEditing(true);
    setIsOpen(true);
  }


  const formik = useFormik<ServiceFormValues>({
    enableReinitialize: true,
    initialValues: {
    title: serviceById?.title ?? '',
    overviewDescription: serviceById?.overview?.description ?? '',
    price: serviceById?.price ?? 0,
    category: serviceById?.category?._id ?? '',
    brands: serviceById?.brands ?? [],
    tags: serviceById?.tags ?? [],
    benefits: serviceById?.overview?.benefits ?? [''],
    faqs: [],
  },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      overviewDescription: Yup.string().required('Overview description is required'),
      price: Yup.number().required('Price is required').positive('Must be positive'),
      category: Yup.object().required('Category is required'),
      brands: Yup.array().required('Brands are required'),
    //   tags: Yup.array().required('Tags are required'),
      benefits: Yup.array(),
    //   faqs: Yup.array().required('FAQs are required'),
    }),
    onSubmit: async (values) => {
      try{
        const data= {
            title: values.title,
            overview:{
                description: values.overviewDescription,
                benefits: values.benefits,
            },
            price: values.price,
            category: values.category,
            brands: (values.brands as unknown as Brand[])?.map((brand:Brand) => brand?._id),
            // faqs: values.faqs,
        }
        dispatch(createService(data));
        
      }catch (error: Error | unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    }
  });



  useEffect(()=>{
    if(formik.values.category){
        dispatch(getBrandsByCategory(formik.values.category));
    }else{
        dispatch(getBrands());
    }
  },[dispatch, formik.values.category])


  useEffect(()=>{
    if(serviceState?.isSuccess && serviceState?.createdService?._id){
        toast.success("Service created successfully");
        formik.resetForm();
    }

    if(serviceState?.isError){
        toast.error(serviceState?.message || "Something went wrong");
        if(serviceState?.message === "Not authorized, Geek not logged in"){
            window.location.href = "/login/geek";
        }
        formik.resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[serviceState?.createdService?._id, serviceState?.isSuccess, serviceState?.isError, serviceState?.message])




  return (
    <section className='w-full flex flex-col items-center justify-center relative'>
        <div className='w-full flex items-center py-12 justify-center'>
            <div  className={`col-span-12 p-2  relative w-full`}>
                <div className="flex w-full md:flex-row flex-col bg-white p-3 mb-4 max-w-5xl mx-auto justify-between gap-3 items-center">
                    <div className='w-full text-2xl  font-bold'>
                        Found <span className='text-teal-600'>{geek?.services?.length} Services</span>
                    </div>

                    {/* <div className='flex w-full items-center justify-end'>
                        <button onClick={()=>setIsOpen(true)} className='px-4 py-2 text-sm text-gray-100 hover:text-white bg-green-500 hover:bg-green-700 cursor-pointer rounded-md'>
                            Create New
                        </button>
                    </div> */}
                    
                </div>
                <div className="grid grid-cols-12 gap-6 max-w-5xl mx-auto">
                {(geek?.services as Service[])?.map((service) => {
                    return <div key={service._id} className="col-span-12 rounded-b-xl pb-4 rounded-md p-4 relative grid grid-cols-6 w-full  border border-gray-200 bg-white">
                        <Link 
                            href={`/services/${service?._id}`}
                            className={`flex  md:flex-row flex-col col-span-4 md:col-span-4 w-full gap-5`}
                            >
                            <div className={`w-full flex gap-4 flex-col sm:flex-row items-center"}`}>
                            
                                <Image width={ 220} height={140} className="rounded-lg"  src={"/assets/images/blogImg.jpg"} alt="Featured product" />
                                
                                
                                <div className="md:pl-4  flex flex-col gap-2 items-center sm:items-start justify-start">
                                    <h6 className={`bg-gray-300 px-4 text-sm text-gray-500 rounded-sm py-0.5 font-bold block`}>{service?.category?.title}</h6>
                                    <p className="text-xl font-bold hover:text-teal-600 text-center sm:text-start text-gray-800">{service?.title}</p>
                                    <p className="text-gray-600">{geek.address?.city + ", " + geek.address?.state}</p>
                                    <div className='flex items-center gap-3'>
                                        
                                        <div className='w-9 h-9 border flex gap-2 relative border-black rounded-full'>
                                            <Image objectFit='cover' className='rounded-full' src={"/assets/images/jobs/laptop-repair.webp"} alt="user Image" layout='fill'  />           
                                        </div>
                                        <Image src={"/assets/icons/star.svg"} alt="Star" width={20} height={20} />
                                        {service?.totalRating} reviews
                                    </div>
                                    
                                </div>
                            </div>
                        </Link>
                    
                        
                        <div className={`w-full mt-2 flex col-span-2  justify-center md:col-span-2"}`}>
                        <div className='flex w-full items-center md:justify-start justify-center'>
                            <h6 className="font-bold text-2xl">₹{service?.price}.00</h6>
                        </div>
                    
                        {userType === "geek" && <div className='flex w-full h-full items-center justify-center'>
                            <button onClick={()=>{handleEditService(service)}} className='bg-gray-200 cursor-pointer text-sm rounded-md w-fit h-fit font-normal px-4 py-2'>
                                Edit Service
                            </button>
                        </div>}
                        </div>
                    </div>
                })}
                    
                    
                    
                </div>                                
            </div>
        </div>
        
        
        {/* <div hidden={!isOpen} onClick={() => setIsOpen(false)} className='fixed  inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div> */}
        {/* <section className='w-full p-4 '>
                        
        <div className={`fixed  top-10 h-[90vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0   max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 `}>

             <section className='w-full flex flex-col items-center  justify-center py-12 md:px-3'>
            <h2 className="text-xl md:text-3xl font-semibold mb-4 text-gray-800 dark:text-white">Create New Service</h2>

            <form onSubmit={formik.handleSubmit} className="max-w-2xl w-full mx-auto md:p-8 p-3 space-y-4 bg-white dark:bg-gray-900 rounded-lg">
                <div className='w-full flex flex-col gap-2 items-start justify-center'>
                    <CustomInput
                    name="title"
                    labelFor="title"
                    title="Service Title"
                    placeholder=""
                    required
                    disabled={false}
                    readOnly={false}
                    type="text"
                    labelBg="bg-white dark:bg-gray-900"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />

                {formik.errors.title && formik.touched.title && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                )}
                </div>

                <div className='w-full flex flex-col gap-2  py-3'>
                    <label className="block px-2 text-sm font-medium text-gray-700 dark:text-gray-200">Overview Description</label>
                    <textarea
                    name="overviewDescription"
                    className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none  dark:bg-gray-800 dark:text-white"
                    rows={3}
                    value={formik.values.overviewDescription}
                    onChange={formik.handleChange}
                    />
                    {formik.errors.overviewDescription && formik.touched.overviewDescription && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.overviewDescription}</p>
                    )}
                </div>

                <div className='w-full flex flex-col sm:flex-row items-center justify-center md:gap-4 gap-6 py-3'>
                    <div className='sm:w-1/3 w-full flex flex-col gap-2'>
                        <CustomInput
                        name="price"
                        labelFor="price"
                        title="Inspection Charge"
                        placeholder=""
                        required
                        disabled={false}
                        readOnly={false}
                        type="number"
                        labelBg="bg-white dark:bg-gray-900"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.price && formik.touched.price && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
                    )}
                    </div>

                        <div className='sm:w-2/3 w-full flex flex-col gap-2'>
                            <select
                            name="category"
                            className="w-full text-gray-700 text-sm py-3 px-2 border rounded-md border-gray-300 focus:outline-none  dark:bg-gray-800 dark:text-white"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            >
                            <option value="">Select Category</option>
                            {categories?.map((category) => (
                                <option key={category._id} value={category._id}>
                                {category.title}
                                </option>
                            ))}
                            </select>
                            {formik.errors.category && formik.touched.category && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                            )}
                        </div>
                </div>

                    <div className='w-full flex flex-col gap-2'>
                        <Multiselect
                        data={brandsByCategory || []}
                        dataKey="id"
                        textField="name"
                        value={formik.values.brands}
                        onChange={(value) => formik.setFieldValue("brands", value)}
                        placeholder="Select Brands"
                        />
                        {formik.errors.brands && formik.touched.brands && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.brands}</p>
                        )}
                    </div>

                <div className='w-full py-3 flex flex-col gap-1 items-start'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Special Benefits:</label>
                    {formik.values?.benefits && formik.values.benefits.map((benefit, index) => (
                    <div 
                        key={index}
                        className="w-full flex  gap-3 items-center"
                    >
                        <input
                        type="text"
                        name={`benefits[${index}]`}
                        value={benefit}
                        onChange={formik.handleChange}
                        className="w-full mt-1 mb-2 p-2 border focus:outline-none border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                        placeholder={`Benefit ${index + 1}`}
                    />
                    <button
                    type="button"
                    onClick={() => formik.setFieldValue('benefits', formik.values.benefits.filter((_, i) => i !== index))}
                    className="text-red-600 text-sm cursor-pointer"
                    >
                        Remove
                    </button>
                    </div>
                    ))}
                    <button
                    type="button"
                    onClick={() => formik.setFieldValue('benefits', [...formik.values.benefits, ''])}
                    className="text-green-600 text-sm cursor-pointer"
                    >
                    + Add Benefit
                    </button>
                </div>

                {/* <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">FAQs</label>
            {formik.values.faqs.map((faq, index) => (

            <input
                key={index}
                type="text"
                name={`faqs[${index}]`}
                value={faq}
                onChange={formik.handleChange}
                className="w-full mt-1 mb-2 p-2 border focus:outline-none border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                placeholder={`FAQ ${index + 1}`}
            />
            ))}
            <button
            type="button"
            onClick={() => formik.setFieldValue('faqs', [...formik.values.faqs, ''])}
            className="text-blue-600 text-sm"
            >
            + Add FAQ
            </button>
                </div> */}

                {/* <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-700 cursor-pointer text-white font-semibold py-2 rounded"
                >
                    {isEditing ? "Edit Service" : "Create Service"}
                </button>
        </form>
        
        </section>
        </div>
        </section>  */}
    </section>
  );
};

export default ServiceCreateForm;
