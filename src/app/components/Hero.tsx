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
      id:slicedCategories[0]?._id,
      title:"Laptops & Desktop",
      subtitle:"Service & Repair",
      image:"/cat-icons/Laptops.png"
    },
    {
      id:slicedCategories[1]?._id,
      title:"Printer",
      subtitle:"Service & Repair",
      image:"/cat-icons/Printer.png",
    },
    {
      id:slicedCategories[3]?._id,
      title:"Router", 
      subtitle:"Service & Repair",
      image:"/cat-icons/Router.png",
    },
    {
      id:slicedCategories[2]?._id,
      title:"Scanner",
      subtitle:"Service & Repair",
      image:"/cat-icons/Scanner.png",
    },
    {
      id:slicedCategories[4]?._id,
      title:"Software",
      subtitle:"Install & Update",
      image:"/cat-icons/Software.png",
    },
    {
      id:slicedCategories[5]?._id,
      title:"Antivirus",
      subtitle:"Install & Update",
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

  

    <section className=" relative p-3 bg-white min-h-auto">
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

      <div className="md:py-10">
        <div className="max-w-7xl mx-auto ">
          <div className="grid  grid-cols-2 gap-6 items-start">
            <div className="col-span-2 order-2 md:order-1 md:col-span-1">
              <div
                className="wow fadeInUp"
              >
                <h1 className=" text-gray-600  md:text-3xl text-2xl leading-12 lg:text-4xl font-bold">
                  Service & Repair {" "}
                  <span className="text-teal-700" data-type-text="Carpenders">@Home</span>
                </h1>
                <p className="my-2 ml-2 text-gray-500 md:text-lg tracking-widest  font-mono  sm:text-base text-sm ">IT Tech support - Anytime, Anywhere.</p>
                <div className="flex items-center gap-8 w-full md:w-[80%] mb-3 py-3 rounded-lg">
                  {/* Location Input */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Location"
                       value={city}
                       onChange={(e) => dispatch(setCity(e.target.value))}
                      className="w-full lg:px-10 px-4 py-2.5 border border-gray-500 rounded-lg 
                                font-bold text-black text-center
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
                        className="w-full inline-flex items-center justify-center gap-2
                                  lg:px-10 md:px-4 py-2.5
                                  border border-gray-500 rounded-lg
                                  font-bold text-black text-center
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
                                    setCategory(option._id);
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


                <div className="w-full md:w-[80%] h-full flex flex-col gap-3 border p-4 rounded-lg border-gray-600">
                  <h1 className="text-xl font-medium text-gray-600">What are you looking for?</h1>
                  <div className="md:p-4 flex flex-col w-full md:gap-4 gap-2 justify-start">
                    <div className="flex  w-full">
                     
                   {displayCategories?.slice(0,3)?.map((cat,i)=>{
                      return  <Link key={i+10} href={`/categories/${cat.id}/brands`} className="flex flex-col w-full">
                      <div className="flex flex-col items-center bg-gray-100 p-3 rounded-lg me-2 md:me-4 mb-1 cursor-pointer hover:bg-teal-700 hover:text-white">
                      <Image 
                        width={80}
                        height={80}
                        decoding="async"
                        src={cat.image}
                        alt="icon"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-center text-sm font-bold">{cat.title}</p>
                      <span className="text-center text-xs">{cat.subtitle}</span>
                    </div>
                    </Link>
                   })}

                    </div>
                    <div className="flex w-full">
                    {displayCategories?.slice(3,6)?.map((cat,i)=>{
                      return  <Link key={i+100} href={`/categories/${cat.id}/brands`} className="flex flex-col w-full">
                      <div className="flex flex-col items-center bg-gray-100 p-3 rounded-lg me-2 md:me-4 mb-1 cursor-pointer hover:bg-teal-700 hover:text-white">
                      <Image 
                        width={80}
                        height={80}
                        decoding="async"
                        src={cat.image}
                        alt="icon"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-center text-sm font-bold">{cat.title}</p>
                      <span className="text-center text-xs">{cat.subtitle}</span>
                    </div>
                    </Link>
                   })}
                    
                    </div>
                  </div>

                  <div className="mt-2 flex justify-center">
                    <Link href="/categories" className="text-sm font-medium bg-teal-600 px-4 py-2 text-white rounded-lg hover:underline">
                      View all categories &rarr;
                    </Link>
                  </div>

                </div>
                
                

                <div className="flex items-center flex-wrap mt-8">
                  <div className="flex items-center mr-4 mt-4">
                  <Image
                      width={40}
                      height={40}
                      decoding="async"
                      src="/assets/icons/success-01.svg"
                      alt="icon"
                    />
                    <div className="ms-2">
                      <h6 className="font-bold mb-1">350+ Geeks</h6>
                      <p className="text-sm text-gray-600">(Tech Support engineer)</p>
                    </div>
                  </div>

                  <div className="flex items-center mr-4 mt-4">
                    <Image
                      width={41}
                      height={40}
                      decoding="async"
                      src="/assets/icons/success-02.svg"
                      alt="icon"
                    />
                    <div className="ms-2">
                      <h6 className="font-bold mb-1">200+</h6>
                      <p className="text-sm text-gray-600">Services Completed</p>
                    </div>
                  </div>

                  <div className="flex items-center mr-4 mt-4">
                  <Image
                      width={41}
                      height={40}
                      decoding="async"
                      src="/assets/icons/success-03.svg"
                      alt="icon"
                    />
                    <div className="ms-2">
                      <h6 className="font-bold mb-1">200+</h6>
                      <p className="text-sm text-gray-600">Happy Clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 order-1 md:order-2 sm:h-full xl:h-fit md:col-span-1 grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <Image
                  src={"/assets/New-Img/Banner/image1.png"}
                  width={400}
                  height={300}
                  alt="banner image"

                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="col-span-3 grid grid-rows-2 gap-4">
                <div className="row-span-1 w-full flex justify-center items-start">
                  <Image
                    src={"/assets/New-Img/Banner/Image2.png"}
                    width={200}
                    height={200}
                    alt="banner image 2"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="row-span-1 grid grid-cols-2 gap-4 items-start">
                  <Image
                    src={"/assets/New-Img/Banner/Image3.png"}
                    width={300}
                    height={300}
                    alt="banner image 3"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Image
                    src={"/assets/New-Img/Banner/Image4.png"}
                    width={300}
                    height={300}
                    alt="banner image 4"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default HeroSectionTen;
