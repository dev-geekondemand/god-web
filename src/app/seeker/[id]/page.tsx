"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadUser, sendVerificationMail, updateProfileImage, updateUserProfile, UserState } from "@/features/seeker/seekerSlice";
import Link from "next/link";
import {  Mail, Phone, PlusIcon } from "lucide-react";
import CustomInput from "@/app/components/CustonInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.seeker) as UserState;
  const router = useRouter();

  const {user,isPending} = userState;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (file: File) => {
    if (!file) return;
    if(!user){
      toast.error('User not found');
      return;
    }

    // File validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG or PNG allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      await dispatch(
        updateProfileImage({ userId: user?._id, image: file })
      ).unwrap();

      toast.success('Profile image updated');
    } catch (err: any) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };



  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

    useEffect(()=>{
    if(userState?.isMailSent){
      toast.success('Verification email sent successfully.',{position: 'top-center',style: { background: '#333', color: '#fff' }});
    }
  },[userState.isMailSent])
 

  const address = user?.address || null;


  const formik = useFormik({
    enableReinitialize: true,
      initialValues: {
          firstName: user?.fullName?.first || '',
          lastName: user?.fullName?.last || '',
          email: user?.email || '',
          phone:  user?.authProvider !== 'custom' && user?.phone?.startsWith('+91') ? user?.phone.slice(3) : user?.phone || '',
      },
      validationSchema: Yup.object({
          firstName: Yup.string().required('First name is required'),
          lastName: Yup.string().required('Last name is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
          phone: Yup.string().when([], () => user?.authProvider === 'custom' ? Yup.string().notRequired() : Yup.string().required('Phone number is required').matches(/^\d{10}$/, 'Phone number must be 10 digits')),  // should not have all numbers as same
      }),
      onSubmit: (values) => {
        const data = {
          fullName: {
            first: values.firstName,
            last: values.lastName,
          },
          email: values.email,
          phone: values.phone
        }
        if (!formik.dirty) {
          toast.error('No changes made.',{position: 'top-center'});
          return;
        }
          dispatch(updateUserProfile(data));
          setIsEditing(false);
      },
  })



   if (isPending || !user) {
    return <div className="text-center flex justify-center text-lg font-semibold w-full h-[80vh] items-center text-gray-600">Loading profile...</div>;
  }

  const azureLoader = ({ src }:{src:string}) => src;

  const handleEmailVerify=()=>{
    dispatch(sendVerificationMail(user?._id || ""));
  }



  return (
    <div className="max-w-4xl mx-auto w-full">
       <div className='w-full relative breadcrumb-bg-2'>
          <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
              <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                  <div className='flex flex-wrap w-full'>
                      <div className='w-full flex flex-col gap-3 items-center justify-center'>
                          <h2 className='text-4xl font-bold text-black'>My Profile</h2>
                          <div className='flex gap-2 items-center'>
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

                          

                         
                          <p className=' text-gray-600'>My Profile</p>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      
      </div>

     <div className="py-12 flex flex-col gap-4 px-4">
       <Card className="flex flex-col md:flex-row items-start md:items-center p-4 gap-6">
        <div className="relative group w-fit">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="border w-30 h-30 flex items-center justify-center border-gray-300 rounded-full">
              <Image
                loader={azureLoader}
                src={
                  imagePreview ||
                  user?.profileImage ||
                  '/assets/images/placeholder_user.jpg'
                }
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full w-full h-full object-cover"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 hidden group-hover:flex items-center justify-center text-white text-sm">
              {uploading ? 'Uploading...' : 'Change'}
            </div>
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageChange(file);
            }}
          />
        </div>



        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-bold">{user?.fullName?.first + " " + user?.fullName?.last}</h2>
          <div className="text-gray-700 flex relative gap-2 w-fit pr-8 items-center"> <Mail className="text-xs w-5 h-5" /> 
          {user?.email ? user.email : "Email not available"}
          <button disabled={user?.isEmailVerified} onClick={handleEmailVerify} className={`absolute cursor-pointer top-0 -right-2 text-xs ${user?.isEmailVerified ? "text-green-500" : "text-teal-600"}`}>{user?.isEmailVerified ? "Verified" : "Verify"}</button>
          </div>
          <div className="text-gray-700 flex gap-1 relative w-fit pr-8 items-center"><Phone className="text-xs w-5 h-5" /> 
          {user?.phone ? user?.phone : "N/A"}
          {/* <button disabled={user?.isPhoneVerified} className={`absolute top-0 -right-2 text-xs ${user?.isPhoneVerified ? "text-green-500" : "text-teal-600"}`}>{user?.isPhoneVerified ? "Verified" : "Verify"}</button> */}
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:ml-auto">
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      </Card>

      {isEditing && (
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="mb-4 flex flex-col gap-2 relative">
                <span onClick={() => setIsEditing(false)} className="absolute top-0 text-xl right-0 cursor-pointer">X</span>
                <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
                <p className="text-gray-600">You can update your profile information here.</p>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-4" action="">
              <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4 flex flex-col gap-2">
                        <CustomInput
                        name="firstName"
                        type="text"
                        placeholder=""
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        labelFor="firstName"
                        title="First Name"
                        required
                        labelBg="bg-white"
                        disabled={false}
                        readOnly={false}

                        />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <div className="text-red-500">{formik.errors.firstName}</div>
                    )}

                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <CustomInput
                        name="lastName"
                        type="text"
                        placeholder=""
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        labelFor="lastName"
                        title="Last Name"
                        required
                        labelBg="bg-white"
                        disabled={false}
                        readOnly={false}
                        />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <div className="text-red-500">{formik.errors.lastName}</div>
                    )}
                    </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4 flex flex-col gap-2">
                        <CustomInput
                        name="email"
                        type="email"
                        placeholder=""
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        labelFor="email"
                        title="Email"
                        required
                        labelBg="bg-white"
                        disabled={user?.authProvider === "custom" ? false : true}
                        readOnly={user?.authProvider === "custom" ? false : true}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <CustomInput
                        name="phone"
                        type="text"
                        placeholder=""
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        labelFor="phone"
                        title="Phone"
                        required
                        labelBg="bg-white"
                        disabled={user?.authProvider === "custom" ? true : false}
                        readOnly={user?.authProvider === "custom" ? true : false}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="text-red-500">{formik.errors.phone}</div>
                        )}
                    </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md">
                  Save Changes
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardContent className="py-4">
          <h3 className="text-lg font-semibold mb-2">Address</h3>
            {address !==null && address?.city ? <div className="flex justify-between items-start w-full">
              <div className="text-gray-700">
                <p>{address?.line1}</p>
              {address?.line2 && <p>{address.line2}</p>}
              <p>
                {address?.city}, {address?.state} - {address?.pin}
              </p>
              </div>
              <Link className="text-teal-600 gap-1 flex items-center" href={`/seeker/${user?._id}/add-address`}><PlusIcon className="" /> Edit Address </Link>

            </div>: <Link className="text-teal-600 gap-1 flex items-center" href={`/seeker/${user?._id}/add-address`}><PlusIcon className="" /> Address </Link>}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">My Bookings</h3>
            <p className="text-gray-600">{user?.requests?.length} total bookings</p>
          </div>
          <Button className="cursor-pointer" onClick={() => router.push(`/seeker/${user?._id}/services`)} variant="secondary">View Bookings</Button>
        </CardContent>
      </Card>
     </div>
    </div>
  );
};

export default UserProfile;
