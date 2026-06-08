"use client"

import React, { useEffect, useState }  from "react";
// import CustomButton from "./CustomButton"
import Image from "next/image";
import { MapPin, Search, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Category } from "@/interfaces/Category";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks";
import { fetchUserLocation, setCity, setShowPrompt } from "../../features/locationSlice";
import CustomToast from "./CustomToast";
import toast from "react-hot-toast";

const HeroSectionTen = () => {

  const router = useRouter();

  const categories = useSelector((state: RootState) => state.category?.categories || []) as Category[];
  const slicedCategories = categories.slice(0,6);
  const displayCategories = [
    {
      id: slicedCategories[0]?.slug || slicedCategories[0]?._id,
      title:"Laptop & Desktop",
      subtitle:"Repair",
      image:"/cat-icons/Laptops.png"
    },
    {
      id: slicedCategories[1]?.slug || slicedCategories[1]?._id,
      title:"Printer",
      subtitle:"Service & Repair",
      image:"/cat-icons/Printer.png",
    },
    {
      id: slicedCategories[3]?.slug || slicedCategories[3]?._id,
      title:"Router",
      subtitle:"Service & Repair",
      image:"/cat-icons/Router.png",
    },
    {
      id: slicedCategories[2]?.slug || slicedCategories[2]?._id,
      title:"Scanner",
      subtitle:"Service & Repair",
      image:"/cat-icons/Scanner.png",
    },
    {
      id: slicedCategories[4]?.slug || slicedCategories[4]?._id,
      title:"Software",
      subtitle:"Installation & Support",
      image:"/cat-icons/Software.png",
    },
    {
      id: slicedCategories[5]?.slug || slicedCategories[5]?._id,
      title:"Antivirus",
      subtitle:"Setup & Protection",
      image:"/cat-icons/Antivirus.png",
    },

  ]

const dispatch = useAppDispatch();
  const { city, loading, showPrompt } = useSelector((state: RootState) => state.location);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Categories");
  const [ category, setCategory ] = useState<string | null>(null);

const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    const storedCity = localStorage.getItem("user_city") || "";
     const hasPromptedThisSession =
      sessionStorage.getItem("location_prompt_shown") === "true";

    dispatch(setCity(storedCity));
    dispatch(setShowPrompt(!hasPromptedThisSession));

    setHydrated(true); // mark as ready
  }
}, [dispatch]);


// useEffect(() => {
//   navigator.permissions?.query({ name: "geolocation" as PermissionName })
//     .then((res) => {
//       if (res.state === "granted") {
//         dispatch(fetchUserLocation());
//         sessionStorage.setItem("location_prompt_shown", "true");
//       }
//     });
// }, []);


const handleSearch = (category: string | null) => {
 if(category){
  router.push(`/categories/${category}/brands`);
 }else{
    toast.custom((t) => (
        <CustomToast
          t={t}
          title="Category not selected."
          message="Please select a category."
          avatar="/assets/logo-big.webp"
        />
      ));
 }
}


    
    // const popularSearch = [{link:"", name:"Antivirus"},{link:"",name:"Laptop Repair"},{link:"",name:"ASUS Laptop"}]

    

  return (

  

    <section className="relative px-3 sm:px-6 py-3 bg-white  flex flex-col ">
        {hydrated && showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-teal-600" />
              <h2 className="text-xl font-bold text-gray-800">Use your location?</h2>
            </div>

            <p className="text-gray-600 mb-6">
              We can automatically detect your city to show nearby IT experts.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  dispatch(setShowPrompt(false));
                  sessionStorage.setItem("location_prompt_shown", "true");
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                No, thanks
              </button>

              <button
                onClick={() => dispatch(fetchUserLocation())}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-800 flex items-center gap-2"
              >
                {loading ? "Detecting..." : "Yes, detect"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-full">
        <div className="w-full max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-2  mmd:gap-6  items-stretch h-full">
            <div className="h-full col-span-2 mmd:col-span-1 flex items-center">
              <div
                className=" fadeInUp h-full w-full flex flex-col justify-center"
              >
                <h1 className="text-gray-600 xxs:text-lg xs:text-xl  md:text-2xl mmd:text-xl lg:text-2xl xl:text-3xl leading-tight font-bold">
                  Doorstep IT Tech Support &amp; Device Repair {" "}
                  <span className="text-teal-700">— At Your Home</span>
                </h1>
                <p className="my-1 xs:my-2 sm:my-1 ml-1 sm:ml-2 font-bold text-teal-800 xxs:text-[12px] xs:text-[12px] sm:text-xs md:text-sm xl:text-base font-mono tracking-wide">Book a verified Geek for laptop, printer, router or software support — same day, at your doorstep.</p>
                <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 mmd:gap-8 w-full  mb-2 py-2 rounded-lg">
                  {/* Location Input */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Location"
                       value={city}
                       onChange={(e) => dispatch(setCity(e.target.value))}
                      className="w-full xxs:px-2 xs:px-3 sm:px-4 lg:px-10 xxs:py-1.5 xs:py-2 sm:py-2.5 border border-gray-500 rounded-lg
                                font-bold text-black text-center xxs:text-xs xs:text-sm
                                focus:outline-none focus:ring-2 focus:ring-black/10"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <MapPin size={20} className="text-white" fill="oklch(51.1% 0.096 186.391)" />
                    </span>
                  </div>

                  <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="w-full inline-flex items-center justify-center gap-1 xs:gap-2
                                  xxs:px-1.5 xs:px-3 md:px-4 lg:px-10 xxs:py-1.5 xs:py-2 sm:py-2.5
                                  border border-gray-500 rounded-lg
                                  font-bold text-black text-center xxs:text-xs xs:text-sm
                                  focus:outline-none focus:ring-2 focus:ring-black/10"
                      >
                        {selected?.slice(0, 10)}...
                        <Image
                          width={16}
                          height={16}
                          src="/assets/icons/sort-down.png"
                          alt=""
                          className={`transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {open && (
                        <div className="absolute z-10 mt-2 w-full h-56 overflow-y-scroll hide-scrollbar bg-white border border-gray-300 rounded-lg shadow-lg">
                          <ul className="p-2 text-sm font-medium text-gray-700">
                            {categories.map((option) => (
                              <li className="cursor-pointer" key={option?._id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected(option.title);
                                    setCategory(option.slug || option._id);
                                    setOpen(false);
                                  }}
                                  className="w-full text-left p-2 rounded hover:bg-gray-300 cursor-pointer"
                                >
                                  {option.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                  <button className="flex flex-col items-center bg-teal-600 py-2 px-3 rounded-md" onClick={()=>{handleSearch(category)}}><Search size={20} className="text-white"/></button>
                </div>


                {/* <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => router.push('/categories')}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors text-sm shadow-md"
                  >
                    Book a Geek
                  </button>
                  <button
                    onClick={() => router.push('/register?type=geek')}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-teal-700 text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-sm"
                  >
                    Become a Geek
                  </button>
                </div> */}

                <div className="w-full  flex flex-col gap-1.5 sm:gap-2 border p-2 sm:p-3 rounded-lg border-gray-600">
                  <h2 className="xxs:text-[10px] xs:text-xs block mmd:hidden xl:block  sm:text-sm mmd:text-base md:text-xl font-medium text-gray-600">Book IT Support by Service Category</h2>
                  <p className="xxs:text-[8px] xs:text-[9px] block mmd:hidden xl:block sm:text-xs text-gray-500">From laptop screen replacement to antivirus setup — our Geeks handle it all, at your doorstep.</p>
                  <div className="flex flex-col w-full gap-2 justify-start">
                    <div className="flex  w-full">
                     
                   {displayCategories?.slice(0,3)?.map((cat,i)=>{
                      return  <Link key={i+10} href={`/categories/${cat.id}/brands`} className="flex flex-col w-full">
                      <div className="flex flex-col items-center bg-gray-100 xxs:p-1.5 xs:p-2 sm:p-3 rounded-lg xxs:me-1 xs:me-2 md:me-4 mb-1 cursor-pointer hover:bg-teal-700 hover:text-white">
                      <Image 
                        width={40}
                        height={40}
                        decoding="async"
                        src={cat.image}
                        alt={`${cat.title} service in Hyderabad`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-center xxs:text-[8px] xs:text-[10px] sm:text-xs mmd:text-sm font-bold leading-tight">{cat.title}</p>
                      <span className="text-center xxs:text-[7px] xs:text-[9px] sm:text-xs leading-tight">{cat.subtitle}</span>
                    </div>
                    </Link>
                   })}

                    </div>
                    <div className="flex w-full">
                    {displayCategories?.slice(3,6)?.map((cat,i)=>{
                      return  <Link key={i+100} href={`/categories/${cat.id}/brands`} className="flex flex-col w-full">
                      <div className="flex flex-col items-center bg-gray-100 xxs:p-1.5 xs:p-2 sm:p-3 rounded-lg xxs:me-1 xs:me-2 md:me-4 mb-1 cursor-pointer hover:bg-teal-700 hover:text-white">
                      <Image 
                        width={40}
                        height={40}
                        decoding="async"
                        src={cat.image}
                        alt={`${cat.title} service in Hyderabad`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-center xxs:text-[8px] xs:text-[10px] sm:text-xs mmd:text-sm font-bold leading-tight">{cat.title}</p>
                      <span className="text-center xxs:text-[7px] xs:text-[9px] sm:text-xs leading-tight">{cat.subtitle}</span>
                    </div>
                    </Link>
                   })}
                    
                    </div>
                  </div>

                  <div className="mt-1 flex justify-center">
                    <Link href="/categories" className="text-sm font-medium bg-teal-600 px-4 py-2 text-white rounded-lg hover:underline">
                      View all categories &rarr;
                    </Link>
                  </div>

                </div>
                
                

                
              </div>
            </div>
            <div className="col-span-0 mmd:col-span-1 relative wow fadeInUp h-full mmd:min-h-[380px]">
                <Image
                src={"/assets/main_hero.png"}
                fill
                alt="Geek providing doorstep IT support at home in Hyderabad"
                className="object-contain"
              />
              {/* <div className="flex items-center flex-wrap mt-2 xs:mt-3">
                  <div className="flex items-center mr-3 xs:mr-4 mt-2">
                  <Image
                      width={30}
                      height={30}
                      decoding="async"
                      src="/assets/icons/success-01.svg"
                      alt="icon"
                    />
                    <div className="ms-1.5 xs:ms-2">
                      <h6 className="font-bold xxs:text-xs xs:text-sm lg:text-base">350+ Geeks</h6>
                      <p className="xxs:text-[9px] xs:text-xs lg:text-sm text-gray-600">(Tech Support engineer)</p>
                    </div>
                  </div>

                  <div className="flex items-center mr-3 xs:mr-4 mt-2">
                    <Image
                      width={30}
                      height={30}
                      decoding="async"
                      src="/assets/icons/success-02.svg"
                      alt="icon"
                      style={{ height: 'auto' }}
                    />
                    <div className="ms-1.5 xs:ms-2">
                      <h6 className="font-bold xxs:text-xs xs:text-sm lg:text-base">200+</h6>
                      <p className="xxs:text-[9px] xs:text-xs lg:text-sm text-gray-600">Services Completed</p>
                    </div>
                  </div>

                  <div className="flex items-center mr-3 xs:mr-4 mt-2">
                  <Image
                      width={30}
                      height={30}
                      decoding="async"
                      src="/assets/icons/success-03.svg"
                      alt="icon"
                      style={{ height: 'auto' }}
                    />
                    <div className="ms-1.5 xs:ms-2">
                      <h6 className="font-bold xxs:text-xs xs:text-sm lg:text-base mb-1">200+</h6>
                      <p className="xxs:text-[9px] xs:text-xs lg:text-sm text-gray-600">Happy Clients</p>
                    </div>
                  </div>
                </div> */}
            </div>
          </div>
          <div className="flex items-center  mt-2 xs:mt-3">
                  <div className="flex items-center mr-3 xs:mr-4 mt-2">
                  <Image
                      width={30}
                      height={30}
                      decoding="async"
                      src="/assets/icons/success-01.svg"
                      alt="icon"
                    />
                    <div className=" xs:ms-2">
                      <h6 className="font-bold xxs:text-xs xs:text-sm lg:text-base">380+ </h6>
                      <p className="xxs:text-[9px] xs:text-xs lg:text-sm text-gray-600">Verified Geeks</p>

                    </div>
                  </div>

                  <div className="flex items-center mr-3 xs:mr-4 mt-2">
                    <Image
                      width={30}
                      height={30}
                      decoding="async"
                      src="/assets/icons/success-02.svg"
                      alt="icon"
                      style={{ height: 'auto' }}
                    />
                    <div className="ms-1.5 xs:ms-2">
                      <h6 className="font-bold xxs:text-xs xs:text-sm lg:text-base">1,000+</h6>
                      <p className="xxs:text-[9px] xs:text-xs lg:text-sm text-gray-600">Seekers Registered</p>
                    </div>
                  </div>

                  <div className="flex items-center mr-3 xs:mr-4 mt-2">
                  <Image
                      width={30}
                      height={30}
                      decoding="async"
                      src="/assets/icons/success-03.svg"
                      alt="icon"
                      style={{ height: 'auto' }}
                    />
                    <div className="ms-1.5 xs:ms-2">
                      <h6 className="font-bold xxs:text-xs xs:text-sm lg:text-base">Live in Hyderabad</h6>
                      <p className="xxs:text-[9px] xs:text-xs lg:text-sm text-gray-600">App on Android &amp; iOS</p>
                    </div>
                  </div>
                </div>
        </div>

       
      </div>
    </section>
  );
};

export default HeroSectionTen;
