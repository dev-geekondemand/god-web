// GeekDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { getBrands } from "@/features/brands/brandsSlice";
import { getCategories } from "@/features/category/categorySlice";
import CustomSelect from "@/app/components/CustomSelect";
import CustomInput from "@/app/components/CustonInput";
// import { Progress } from "@/components/ui/progress";
import Geek from "@/interfaces/Geek";
import { Category } from "@/interfaces/Category";
import { BadgeCheck, Cross, OctagonX, Pencil, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Multiselect } from "react-widgets";
import "react-widgets/styles.css";
import { deleteRateCard, sendVerificationMail, updateGeekProfile, verificationStatus } from "@/features/geek/geekSlice";
import AadhaarVerificationForm from "@/app/components/adhaarForm";
import AddressForm from "@/app/components/AddressForm";
import ProfileImageUpload from "@/app/components/ImageUpload";
import ProfileImage from "@/app/components/ProfileImage";
import RateCardSection from "@/app/components/RateCard";
import Brand from "@/interfaces/Brand";
import GlobalSkeleton from "@/app/components/Sekeletn";



interface SkillWithBrands {
  categoryId: string;
  brands: Brand[];
}



const Languages = [
  "English","Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu",
  "Gujarati", "Kannada", "Odia", "Malayalam", "Punjabi",
  "Assamese", "Maithili", "Santali", "Kashmiri", "Nepali",
  "Konkani", "Sindhi", "Dogri", "Manipuri"
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openAdhaarForm, setOpenAdhaarForm] = useState(false);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openRateCard, setOpenRateCard] = useState(false);
  const [updating, setUpdating] = useState(false);
const [isMailSent, setIsMailSent] = useState(false);
const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const geekState = useSelector((state: RootState) => state.geek);
  const geek: Geek = useSelector((state: RootState) => state.geek?.geek as Geek);
  const geekId = geek?._id;
  const brands = useSelector((state: RootState) => state.brand?.brands) as Brand[];
  const categories = useSelector((state: RootState) => state.category?.categories) as Category[];
  const selectedCategory = geek?.primarySkill || null;
const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
const [tempSkill, setTempSkill] = useState<SkillWithBrands>({
  categoryId: "",
  brands: [],
});

  

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



const getCategoryById = (categories: Category[], id?: string) =>
  categories.find(c => c._id === id);

const getBrandsByCategoryId = (brands: Brand[], categoryId?: string) =>
  brands.filter(b => b.category?._id === categoryId);

const isSecondaryCategoryAdded = (
  skills: SkillWithBrands[],
  categoryId: string
) => skills.some(s => s.categoryId === categoryId);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: geek?.fullName?.first || "",
      lastName: geek?.fullName?.last || "",
      email: geek?.email || "",
      mobile: geek?.mobile || "",
      yoe: geek?.yoe,
      modeOfService: geek?.modeOfService || "",
      primarySkill: {
      categoryId: geek?.primarySkill?._id || "",
      brands: geek?.brandsServiced?.filter(
        (b: Brand) => b?.category?._id === geek?.primarySkill?._id
      ) || [],
    },
    secondarySkills: (geek?.secondarySkills || []).map((cat: Category) => ({
      categoryId: cat._id,
      brands: geek?.brandsServiced?.filter(
        (b: Brand) => b?.category?._id === cat._id
      ) || [],
    })),
      brandsServiced: geek?.brandsServiced || [],
      languagePreferences: geek?.languagePreferences || [],
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      yoe: Yup.number().min(0, "Experience must be positive").required("Experience is required"),
      modeOfService: Yup.string().required("Mode of service is required"),
      primarySkill: Yup.object({
      categoryId: Yup.string().required("Primary skill is required"),
      brands: Yup.array().min(1, "Select at least one brand"),
    }),
    secondarySkills: Yup.array().of(
      Yup.object({
        categoryId: Yup.string().required(),
        brands: Yup.array().min(1, "Select at least one brand"),
      })
    ),
      brandsServiced: Yup.array(),
      languagePreferences: Yup.array().min(1, "At least one language is required"),
    }),
    onSubmit: async (values) => {
        
        try {
            setUpdating(true);
                const allBrands = [
                ...values.primarySkill.brands,
                ...values.secondarySkills.flatMap(s => s.brands),
            ];

            const payload = {
                primarySkill: values.primarySkill.categoryId,
                secondarySkills: values.secondarySkills.map(s => s.categoryId),
                brandsServiced: Array.from(
                new Map(allBrands.map(b => [b._id, b])).values()
                ).map(b => b._id),
            };

            const updatedDetails = {
            fullName: {
                first: values.firstName,
                last: values.lastName,
            },
            email: values.email,
            mobile: values.mobile,
            yoe: values.yoe,
            modeOfService: values.modeOfService,
            ...payload,
            languagePreferences: values.languagePreferences,
            };
            await dispatch(updateGeekProfile({ id: geekId, data: updatedDetails })).unwrap();
        } catch (error: Error | unknown) {
           if(error instanceof Error){
            toast.error(error.message);
           }else{
            console.error('Unknown error:', error);
           }
        }finally{
            setUpdating(false);
        }
    }
  });

  const handleEmailVerify = () => {
    setIsMailSent(true);
     dispatch(sendVerificationMail(geek?._id || ""))
  }

  useEffect(() => {
      if(geekState?.isMailSent === true && geekState?.isSuccess){
        setIsMailSent(true);
          toast.dismiss();
          toast.success('Verification mail sent successfully',{
              id: 'mailSent',
              position: 'top-center',
              style: {
                  background: '#333',
                  color: '#fff',
              }
          });
        setIsMailSent(true);
      }else{
        setIsMailSent(false);
      }
  },[geekState?.isMailSent, geekState?.isSuccess]);
  


  useEffect(()=>{
    if(geekState?.isProfileUpdated === true && updating === false && geekState?.isSuccess){
         toast.dismiss();
         toast.success('Profile updated successfully');
         setOpen(false);
         window.location.reload();
    }
  },[geekState?.isProfileUpdated, geekState?.isSuccess, updating])
  

  useEffect(() => {
      if(geek?._id){
            if(geek?.idProof?.isAdhaarVerified===false && geek?.idProof?.status && geek?.idProof?.status === 'Requested'){
            dispatch(verificationStatus(geek?.idProof?.requestId));
        }else if(geek?.idProof?.isAdhaarVerified ===false && geek?.idProof?.status && geek?.idProof?.status === 'Completed'){
            toast.success('Aadhaar verification was completed successfully');
        }else{
          
        }
      }
  },[geek?.idProof?.isAdhaarVerified, geek?.idProof?.status, geek?.idProof?.requestId, dispatch, geek?._id]);

  


  const azureLoader = ({ src }:{src:string}) => src;
useEffect(() => {
    const selectedSkillIds = [
        formik.values.primarySkill?.categoryId,
        ...formik.values.secondarySkills.map((skill) => skill.categoryId ),
    ].filter(Boolean);

    const brandsFilteredByCategory = brands?.filter((brand: Brand) =>
        selectedSkillIds.includes(brand?.category?._id)
    );
    setFilteredBrands(brandsFilteredByCategory);
}, [formik.values.primarySkill, formik.values.secondarySkills, brands]);



const handleDeleteRateCard = async (rateId:string) => {
    await dispatch(deleteRateCard({ id: geek._id, rateCardId: rateId })).unwrap();
    
}

useEffect(()=>{
  if(geekState?.isRateCardDeleted === true && geekState?.isSuccess){
    toast.dismiss();
    toast.success('Rate card deleted successfully');
    window.location.reload();
  }
},[geekState?.isRateCardDeleted, geekState?.isSuccess])

useEffect(() => {
  formik.setFieldValue("primarySkill.brands", []);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [formik.values.primarySkill.categoryId]);



useEffect(() => {
  if (!geek || brands.length === 0 || categories.length === 0) return;

  const primaryCategoryId = geek.primarySkill?._id;

  const primaryBrands = brands.filter(
    b =>
      b.category?._id === primaryCategoryId &&
      geek.brandsServiced?.some(gb => gb._id === b._id)
  );

  const secondarySkills: SkillWithBrands[] =
    geek.secondarySkills?.map(cat => ({
      categoryId: cat._id,
      brands: brands.filter(
        b =>
          b.category?._id === cat._id &&
          geek.brandsServiced?.some(gb => gb._id === b._id)
      ),
    })) || [];

  formik.setValues({
    ...formik.values,
    primarySkill: {
      categoryId: primaryCategoryId,
      brands: primaryBrands,
    },
    secondarySkills,
  });
}, [geek, brands, categories]);


const getSecondarySkillsWithBrands = (
  secondarySkills: Category[] = [],
  brands: Brand[] = []
) => {
  return secondarySkills.map(skill => ({
    category: skill,
    brands: brands.filter(
      b => b.category?._id === skill._id
    ),
  }));
};



const getPrimarySkillBrands = (
  primarySkill: Category,
  brands: Brand[] = []
) => (  brands.filter(b => b.category?._id === primarySkill._id));




const isLoadging = geekState?.isLoading || updating;


  return (
       <div className='w-full h-full flex flex-col bg-gray-100 md:p-24 p-4'>
           
           {isLoadging ? <div className="w-full h-full bg-white max-w-6xl mx-auto">
            <GlobalSkeleton cards={4} cols={4} lgCols={4} /> 
           </div>: <div className='w-full h-full max-w-5xl mx-auto bg-white text-black dark:bg-black dark:text-white flex flex-col items-center justify-center pb-12'>
               <div className='w-full sm:h-30 h-56 relative mb-8 p-2'>
                   {/* <Image width={500} height={500} className='object-cover w-full h-72 rounded-xl' src="/assets/profile.jpg" alt="" /> */}
   
                   {/* <div className="absolute -bottom-8 md:-bottom-16 lg:left-30 left-1/2 transform -translate-x-1/2 bg-white dark:bg-black border-green-500 dark:border-gray-800 border-2 w-16 h-16 sm:w-32 sm:h-32 rounded-full overflow-hidden group shadow-md"> */}
                        <ProfileImage
                            imageUrl={geek?.profileImage?.url}
                            azureLoader={azureLoader}
                            setOpenImageUpload={setOpenImageUpload}
                        />

                    {/* </div> */}


                   <div className='absolute right-10 top-10'>
                        <button onClick={() => setOpen(true)} className='text-sm text-teal-600 hover:underline hover:text-teal-600 flex gap-1 items-center'><Pencil className=' text-sm ' /> <span className='mt-1.5'>Edit Profile</span></button>
                   </div>
               </div>

               
   
               <div className='w-full flex sm:flex-row flex-col justify-between'>
                    <div className='w-full flex flex-col items-start justify-start md:p-12 p-3'>
                   
                       <div className='flex justify-between gap-3 w-full items-end mb-4'>
                           <div className='flex flex-col  gap-1'>
                               <h3 className="h2">{geek?.fullName?.first} {geek?.fullName?.last}</h3>
                               <div className='flex flex-wrap divide-x divide-gray-600  items-center gap-4'>
                                    <div className=' text-start pr-8 py-2 relative'>{geek?.email || 'Email Not Provided'}
                                        {geek?.isEmailVerified ? <span className="absolute text-green-500 text-xs top-0 right-2">Verified</span>
                                        : <button disabled={isMailSent} onClick={handleEmailVerify} className={`absolute cursor-pointer text-teal-600 text-xs top-0 right-2 ${isMailSent ? 'cursor-not-allowed' : 'border-teal-200'}`}>{isMailSent ? 'Sent' : geek?.email?.length > 0 ? "Verify" : ""}</button>    
                                    }
                                         </div>
                                    <h4 className=' text-start'>{geek?.mobile || 'Mobile Not Provided'} </h4>
                               </div>
                           </div>
   
                        
                       </div>
                       <div className='flex flex-wrap gap-6 divide-gray-400 divide-x'>
                          
   
                           {/* <div className='flex flex-col justify-center items-start pr-4 pl-1'>
                               <h4 className="p">Active Since</h4>
                               <h5 className="h5">{new Date(geek?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h5>
                           </div> */}
   
                           
   
                           <div className='flex flex-col justify-center items-start pr-4 pl-1'>
                               <h4 className="p">Last Updated</h4>
                               <h5 className="h5">{new Date(geek?.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h5>
                           </div>

                           <div className='flex flex-col justify-center items-start pr-4 pl-1'>
                               <h4 className="p">Experience</h4>
                               <h5 className="h5">{geek?.yoe} Years</h5>
                           </div>

                            
                        </div>
                       
               </div>

                        <div className='md:w-1/2 w-full flex justify-center px-4 my-2 items-center'>
                            {geek?.idProof?.isAdhaarVerified && geek?.idProof?.idNumber ? <div className='flex flex-col gap-2 justify-center items-center'>
                                <h4 className="p flex items-center gap-2"><BadgeCheck className='text-teal-600' /> Adhaar Verified</h4>
                                
                            </div> : <div className='flex sm:flex-col flex-row flex-wrap gap-2 justify-center items-center'>
                                <h4 className="p text-sm flex items-center gap-2"><OctagonX className='text-red-500' /> Adhaar Not Verified</h4>
                                <button onClick={() => setOpenAdhaarForm(true)} className='hover:text-teal-600 cursor-pointer text-teal-600 text-sm'>Click to Verify Adhaar.</button>
                            </div>}
                        </div>

               </div>

               <section className='w-full flex gap-2 flex-col items-start justify-start md:px-12 p-3'>


                   <div className="w-full flex flex-col gap-3">
                        <h3 className="h6">Primary Skill:</h3>

                        {geek?.primarySkill ? (
                            <div className="flex flex-col gap-4">
                            <div className="border border-gray-200 rounded-md p-3">
                                <p className="font-medium text-sm text-gray-800 mb-2">
                                {geek?.primarySkill?.title}
                                </p>
                                {getPrimarySkillBrands(geek?.primarySkill, geek?.brandsServiced)?.length > 0 && (
                            <div className="flex gap-4 flex-wrap">
                            {getPrimarySkillBrands(geek?.primarySkill, geek?.brandsServiced).map((brand) => (
                                <span
                                        key={brand._id}
                                        className="text-xs text-nowrap bg-gray-100 px-2 py-1 rounded-md"
                                        >
                                        {brand.name}
                                        </span>
                            ))}
                            </div>
                        )}
                            </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No primary skill added</p>
                        )}

                        
                        
                    </div>

                

                   <div className="w-full flex flex-col gap-3">
                        <h3 className="h6">Secondary Skills:</h3>

                        {getSecondarySkillsWithBrands(
                            geek?.secondarySkills,
                            geek?.brandsServiced
                        ).length === 0 ? (
                            <p className="text-sm text-gray-500">No secondary skills added</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                            {getSecondarySkillsWithBrands(
                                geek?.secondarySkills,
                                geek?.brandsServiced
                            ).map(({ category, brands }) => (
                                <div
                                key={category._id}
                                className="border border-gray-200 rounded-md p-3"
                                >
                                <p className="font-medium text-sm text-gray-800">
                                    {category.title}
                                </p>

                                {brands.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                    {brands.map(brand => (
                                        <span
                                        key={brand._id}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                                        >
                                        {brand.name}
                                        </span>
                                    ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">
                                    No brands selected
                                    </p>
                                )}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>


                   <div className='w-full flex flex-wrap gap-3 items-center'>
                       <h3 className='h6 text-nowrap'>Mode of Service:</h3>
                       <div className=' flex md:gap-3 gap-1 items-center flex-wrap'>
                            <div className={`${geek?.modeOfService === "All" || geek?.modeOfService === "Online" ? "border-2 border-green-500" : "border border-black"}  bg-gray-50 px-2 py-1 rounded-md text-xs font-bold`}>Online</div>
                            <div className={`${geek?.modeOfService === "All" || geek?.modeOfService === "Offline" ? "border-2 border-green-500" : "border border-black"} bg-gray-50  px-2 py-1 rounded-md text-xs font-bold`}>Offline</div>
                            <div className={`${geek?.modeOfService === "All" || geek?.modeOfService === "Carry In" ? "border-2 border-green-500" : "border border-black"} bg-gray-50  px-2 py-1 rounded-md text-xs font-bold`}>Carry In</div>
                            <div className={`${geek?.modeOfService === "None" ? "border-2 border-green-500" : "border border-black"} bg-gray-50  px-2 py-1 rounded-md text-xs font-bold`}>None</div>
                       </div>
                   </div>


                    {/* <div className='w-full flex flex-wrap font-normal gap-3 items-center'>
                       <h3 className='h6 text-nowrap font-semibold'>Brands Serviced:</h3>
                       
                           {
                               geek?.brandsServiced?.map((brand: Brand,i:number) => (
                                   <p key={brand._id} className=' text-sm'>{i< geek?.brandsServiced?.length-1 ? `${brand.name}, ` : brand.name}</p>
                               ))
                            }
                      
                   </div>  */}

                   <div className='w-full flex flex-wrap gap-3 items-center'>
                       <h3 className='h6 text-nowrap'>Address:</h3>
                       <address className='text-sm'>{geek?.address?.line1} {geek?.address?.line2} {geek?.address?.city}, {geek?.address?.state}, {geek?.address?.pin}</address>
                       <button onClick={()=>{setOpenAddressForm(true)}} className="text-pink font-medium text-sm underline text-teal-600 cursor-pointer">Edit Address</button>
                    </div> 

                    {geek?.languagePreferences?.length > 0 && <div className='w-full flex gap-3 items-start'>
                       <h3 className='h6 text-nowrap'>Languages:</h3>
                       <div className='w-full flex flex-wrap gap-3 items-center mt-1.5'>
                           {
                               geek?.languagePreferences?.map((language: string,i:number) => (
                                   <p key={language} className=' font-medium text-sm'>{ `${i<geek?.languagePreferences?.length-1 ? `${language}, ` : language}` }</p>
                               ))
                            }
                       </div>
                   </div> }     

                   {geek?.rateCard?.length > 0 ? <div className='w-full flex flex-wrap gap-3 items-center'>
                       <h3 className='h6 text-nowrap'>Rate Card:</h3>
                       <button onClick={()=>{setOpenRateCard(true)}} className="text-pink font-medium text-sm underline text-teal-600 cursor-pointer">Edit</button>
                        <div className="flex flex-wrap gap-4 mt-4">
                                {geek?.rateCard?.map((card) => (
                                    <div
                                    key={card._id}
                                    className="border relative rounded-2xl flex flex-col gap-1 p-4 shadow-sm bg-white"
                                    >
                                     <Trash2 onClick={() => handleDeleteRateCard(card._id)} className="absolute bottom-1 right-3 cursor-pointer text-gray-700 hover:text-red-500 w-4 h-4" />
                                    <div className="font-medium text-base">{card.skill?.title}</div>
                                    <div className="text-xs text-gray-600">
                                        Charge Type: <span className="font-normal">{card.chargeType}</span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Rate: <span className="font-normal">₹{card.rate}</span>
                                    </div>
                                    </div>
                                ))}
                                </div>
                   </div>: <button onClick={()=>{setOpenRateCard(true)}} className='text-base cursor-pointer flex gap-1 text-teal-600'>
                            <Plus className='text-teal-600' /> Rate Card
                   </button> }


                   {geek?.qualifications?.length > 0 ? <div className='w-full flex gap-3 items-center'>
                       <h3 className='h6 text-nowrap'>Qualifications:</h3>
                       <div className='w-full flex gap-3 items-center'>
                           {/* {
                               geek?.qualifications?.map((qual: any,i:number) => (
                                   <p key={qual._id} className=' font-medium text-sm'>{i<4 ?  `${i<geek?.qualifications?.length-1 ? `${qual.title}, ` : qual.title}` : `...`}</p>
                               ))
                            } */}
                       </div>
                   </div>: <div className='text-base flex gap-1 text-teal-600'>
                            {/* <Plus className='text-teal-600' /> Qualifications */}
                   </div> }

                   {geek?.availability?.length > 0 ? <div className='w-full flex gap-3 items-center'>
                       <h3 className='h6 text-nowrap'>Availibility:</h3>
                       <div className='w-full flex gap-3 items-center'>
                           {/* {
                               geek?.availility?.map((avail: any,i:number) => (
                                   <p key={avail._id} className=' font-medium text-sm'>{i<4 ?  `${i<geek?.availility?.length-1 ? `${avail.title}, ` : avail.title}` : `...`}</p>
                               ))   
                            } */}
                       </div>
                   </div>: <div className='text-base flex gap-1 text-teal-600'>
                            {/* <Plus className='text-teal-600' /> Availibility */}
                   </div> }
                    
                
                    

               </section>


               <div hidden={!openAddressForm} onClick={() => setOpenAddressForm(false)} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>

                {openAddressForm && <div className='fixed flex top-10 h-[70vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0  items-center justify-center  max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 '>
                    <AddressForm  />
                </div>}


                <div hidden={!openAdhaarForm} onClick={() => setOpenAdhaarForm(false)} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>

                {openAdhaarForm && <div className='fixed top-10 h-[50vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0 flex items-center justify-center  max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 '>
                    <AadhaarVerificationForm status={geek?.idProof?.status} />
                </div>}


                <div hidden={!openImageUpload} onClick={() => setOpenImageUpload(false)} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>

                {openImageUpload && <div className='fixed top-10 h-[50vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0 flex items-center justify-center  max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 '>
                   <button onClick={() => setOpenImageUpload(false)} className="absolute cursor-pointer top-2 right-5 text-2xl">X</button>
                    <ProfileImageUpload imageUrl={geek?.profileImage?.url} geekId={geek?._id} />
                </div>}



                <div hidden={!openRateCard} onClick={() => setOpenRateCard(false)} className='fixed inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>


                {geek && openRateCard && <div className='fixed top-10 h-[80vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0 flex items-center justify-center  max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 '>
                   <button onClick={() => setOpenRateCard(false)} className="absolute cursor-pointer top-2 right-5 text-2xl">X</button>
                    {geek && <RateCardSection geek={geek} />}
                </div>}







           
            <div hidden={!open}  className='fixed  inset-0 bg-gray-200 opacity-90 z-50 transition-opacity duration-300'></div>
               {open && <section className='w-full p-4 '>
                        
                    <div className={`fixed  top-10 h-[90vh] overflow-y-scroll custom-scrollbar bottom-10 right-0 left-0   max-w-3xl mx-auto bg-white shadow-lg z-50 transform transition-transform duration-300 `}>
                    
                   <div className='px-10 relative py-20 flex flex-col gap-5'>
                    <div className="absolute top-4 right-4 cursor-pointer"><X onClick={() => setOpen(false)} /></div>
                        <div className='flex flex-col justify-center items-center mb-8'>
                            <h4 className='h2'>Edit Profile</h4>
                            <div className='w-36 h-1 bg-teal-500'></div>
                        </div>

                        <form onSubmit={formik.handleSubmit} >
                                          <div className=' items-center justify-around md:gap-12 gap-4 px-3 py-2'>
                        <div className='md:col-span-3 col-span-5 md:col-start-3 '>
                            <div className='flex  md:gap-16 gap-4 justify-evenly w-full'>
                            <div className='w-full max-w-xs'>
                                <CustomInput
                                    readOnly={false}
                                    disabled={false}
                                    title="First Name"
                                    labelFor="firstName"
                                    value={formik.values.firstName}
                                    name="firstName"
                                    required={true}
                                    onChange={formik.handleChange}
                                    placeholder="Enter first name"  
                                    type="text"
                                    labelBg="bg-white"
                                    />
                                {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-sm text-red-500">{formik.errors.firstName}</p>
                                )}

                            </div>
                            <div className='w-full max-w-xs'>
                                <CustomInput
                                    readOnly={false}
                                    disabled={false}
                                    title="Last Name"
                                    labelFor="lastName"
                                    value={formik.values.lastName}
                                    name="lastName"
                                    required={true}
                                    onChange={formik.handleChange}
                                    placeholder="Enter first name"  
                                    type="text"
                                    labelBg="bg-white"
                                    />
                                {formik.touched.lastName && formik.errors.lastName && (
                                <p className="text-sm text-red-500">{formik.errors.lastName}</p>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex w-full items-center md:gap-12 gap-4 px-3 py-2'>
    
                        <div className='w-full  flex'>
                            <div className='flex  w-full gap-4 md:gap-8 lg:gap-12 justify-between'>
                            <div className='w-full flex flex-col gap-1'>
                                <CustomInput
                                    readOnly={false}
                                    disabled={false}
                                    title="Email"
                                    labelFor="email"
                                    value={formik.values.email}
                                    name="email"
                                    required={true}
                                    onChange={formik.handleChange}
                                    placeholder=""  
                                    type="email"
                                    labelBg="bg-white"
                                    />
                                {formik.touched.email && formik.errors.email && (
                                <p className="text-sm text-red-500">{formik.errors.email}</p>
                                )}
                            </div>
                            <div className='w-full flex flex-col gap-1'>
                                <CustomInput
                                    title="Mobile"
                                    labelFor="mobile"
                                    value={formik.values.mobile}
                                    name="mobile"
                                    required={true}
                                    onChange={formik.handleChange}
                                    placeholder="Enter mobile number"  
                                    type="text"
                                    readOnly={true}
                                    disabled={true}
                                    labelBg="bg-white"
                                    />
                                {formik.touched.mobile && formik.errors.mobile && (
                                <p className="text-sm text-red-500">{formik.errors.mobile}</p>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>
    

                       

                   

                    <div className='flex w-full my-3 items-center  md:gap-6 lg:gap-8 gap-4 px-3 py-2 pb-2 '>
                            <div className='w-full flex flex-col gap-1 max-w-xl'>
                                <CustomInput
                                    readOnly={false}
                                    disabled={false}
                                    title="Experience (Years)"
                                    labelFor="yoe"
                                    value={formik.values?.yoe}
                                    name="yoe"
                                    required={true}
                                    onChange={formik.handleChange}
                                    placeholder=""  
                                    type="number"
                                    labelBg="bg-white"
                                    />
                                {formik.touched.yoe && formik.errors.yoe && (
                                <p className="text-sm text-red-500">{formik.errors.yoe}</p>
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-1">
                                <label className="text-sm text-gray-500" htmlFor="modeOfService">Mode of Service</label>
                                <select
                                    id="modeOfService"
                                    name="modeOfService"
                                    value={formik.values.modeOfService}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full bg-white border text-gray-500 text-sm border-gray-300 flex items-center justify-between px-3 outline-none py-2 rounded-md"
                                >
                                    <option value="">Mode of Service</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Carry In">Carry In</option>
                                    <option value="All">All</option>
                                    <option value="None">None</option>
                                </select>

                                {formik.touched.modeOfService && formik.errors.modeOfService && (
                                    <p className="text-sm text-red-500">{formik.errors.modeOfService}</p>
                                )}
                                </div>


                          

                           
                           
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                            <label className="text-sm text-gray-500" htmlFor="languagePreferences">Language Preferences:</label>
                                <Multiselect
                                    data={Languages}
                                    value={formik.values.languagePreferences}
                                    onChange={(value) => formik.setFieldValue("languagePreferences", value)}
                                    placeholder="Select Language Preferences"
                                    />
                                    {formik.touched.languagePreferences && formik.errors.languagePreferences && (
                                    <p className="text-sm text-red-500">{formik.errors.languagePreferences}</p>
                                    )}

                            </div>




                        <div className='w-full flex flex-col gap-2 my-4'>
                            <label className="text-sm text-gray-500" htmlFor="primarySkill">Primary Skill:</label>
                            <select
                            value={formik.values.primarySkill?.categoryId}
                            onChange={(e) => {
                                formik.setFieldValue("primarySkill", {
                                categoryId: e.target.value,
                                brands: [],
                                });
                            }}
                            className="w-full bg-white border text-gray-500 text-sm border-gray-300 flex items-center justify-between px-3 outline-none py-2 rounded-md"
                            >
                            <option value="">Select Primary Skill</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.title}</option>
                            ))}
                            </select>

                           <div className="flex flex-col gap-1 my-2">
                            <label className="text-sm text-gray-500" htmlFor="">Brands for Primary Skill:</label>
                             <Multiselect
                            data={getBrandsByCategoryId(
                                brands,
                                formik.values.primarySkill?.categoryId
                            )}
                            dataKey="_id"
                            textField="name"
                            value={formik.values.primarySkill?.brands}
                            onChange={(value) =>
                                formik.setFieldValue("primarySkill.brands", value)
                            }
                            
                            />
                           </div>

                            
                        </div>


                            



                        <div className="flex flex-col gap-3 border border-gray-300 rounded-md p-2">
                            <label className="text-sm text-gray-500" htmlFor="secondarySkills">Secondary Skills:</label>
                            {formik.values.secondarySkills.map((skill, index) => {
                                const category = getCategoryById(categories, skill.categoryId);

                                return (
                                    <div key={skill.categoryId} className=" p-4 rounded-md shadow-md">
                                    <p className="font-medium text-gray-600 mb-3">{`Secondary Skill ${index + 1}:  ${category?.title}`}</p>

                                    <Multiselect
                                        data={getBrandsByCategoryId(brands, skill.categoryId)}
                                        dataKey="_id"
                                        textField="name"
                                        value={skill.brands}
                                        onChange={(value) =>
                                        formik.setFieldValue(
                                            `secondarySkills.${index}.brands`,
                                            value
                                        )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="text-white text-sm mt-2 bg-red-500 py-1.5 px-3 rounded-md"
                                        onClick={() =>
                                        formik.setFieldValue(
                                            "secondarySkills",
                                            formik.values.secondarySkills.filter(
                                            s => s.categoryId !== skill.categoryId
                                            )
                                        )
                                        }
                                    >
                                        Remove
                                    </button>
                                    </div>
                                );
                                })}


{isSecondaryOpen &&  (

                           <div>
                             <select
                                value={tempSkill.categoryId}
                                onChange={(e) =>
                                    setTempSkill({ categoryId: e.target.value, brands: [] })
                                }
                                className="w-full my-4 bg-white border text-gray-500 text-sm border-gray-300 flex items-center justify-between px-3 outline-none py-2 rounded-md"
                                >
                                <option value="">Select Skill</option>
                                {categories
                                    .filter(c => c._id !== formik.values.primarySkill.categoryId)
                                    .map(c => (
                                    <option
                                        key={c._id}
                                        value={c._id}
                                        disabled={isSecondaryCategoryAdded(
                                        formik.values.secondarySkills,
                                        c._id
                                        )}
                                    >
                                        {c.title}
                                    </option>
                                    ))}
                                </select>
                                
                                <div className="flex flex-col gap-1 my-2">
                                    <label className="my-1 text-gray-500 text-sm" htmlFor="">Select Brands for Secondary Skill</label>
                                <Multiselect
                                data={getBrandsByCategoryId(brands, tempSkill.categoryId)}
                                dataKey="_id"
                                textField="name"
                                value={tempSkill.brands}
                                onChange={(value) =>
                                    setTempSkill(prev => ({ ...prev, brands: value }))
                                }
                                />
                                </div>

                                <button
                                disabled={!tempSkill.categoryId || tempSkill.brands.length === 0}
                                onClick={() => {
                                    formik.setFieldValue("secondarySkills", [
                                    ...formik.values.secondarySkills,
                                    tempSkill,
                                    ]);
                                    setTempSkill({ categoryId: "", brands: [] });
                                    setIsSecondaryOpen(false);
                                }}
                                className="flex my-3 items-center gap-2 text-white px-5 py-2 rounded-md cursor-pointer bg-teal-600 text-sm font-medium mt-3 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                Add Skill
                                </button>
                           </div>

                    )
                    
                    
                    }

                                <button
                                    type="button"
                                    disabled={
                                        !formik.values.primarySkill.categoryId  || isSecondaryOpen

                                    }
                                    onClick={() => setIsSecondaryOpen(true)}
                                    className="flex my-3 items-center gap-2 text-teal-600 text-sm font-medium mt-3 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                    <Plus className="w-4 h-4" />
                                    Add Secondary Skill
                                    </button>
                        </div>


                    

                            <button disabled={updating} type="submit" className={`bg-primary ${updating && "opacity-50"} cursor-pointer text-white py-2 px-4 rounded-md w-full mt-4`}>{updating ? "Updating..." : "Update Profile"}</button>
                        </form>
                   </div>
                </div>
               </section>}
   
           </div>}
       </div>
  )
}

export default Dashboard
