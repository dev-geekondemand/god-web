"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustonInput';
import CustomSelect from '../components/CustomSelect';
import ServiceCard from '../components/ServiceCard';
import { useAppDispatch } from '@/lib/hooks';
import { getServices } from '@/features/service/serviceSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Service, ServiceAr, } from '@/interfaces/Service';
// import { Category } from '@/interfaces/Category';
const options = [
    { sort: "createdAt", order: "desc", label: "Date, New to Old" },
    { sort: "createdAt", order: "asc", label: "Date, Old to New" },
    { sort: "title", order: "desc", label: "Alphabetically, Z-A" },
    { sort: "title", order: "asc", label: "Alphabetically, A-Z" },
    { sort: "price", order: "asc", label: "Price, low to high" },
    { sort: "price", order: "desc", label: "Price, high to low" }
];



const Services = () => {

    const [grid, setGrid] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [itemsPerPage,setItemsPerPage] = useState(5);
    const [isOpen, setIsOpen] = useState(false);

    const [selectedOption, setSelectedOption] = useState(options[0]?.label || '');

    const dispatch = useAppDispatch();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const selectOption = (option:string) => {
        setSelectedOption(option);
        handleSorting(option);
        setIsOpen(false);
    };

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setGrid(12);
        }
    }, []);

    useEffect(()=>{
        dispatch(getServices());
    },[dispatch])



    const services = useSelector((state: RootState) => state.service?.services) as unknown as ServiceAr;
    const serviceArray = services?.services as Service[];
    
    


    const handlePageChange = (page:number) => {
        setCurrentPage(page);
    };



    const handleSorting = (label:string) => {
        const selectedOption = options.find(op => op.label === label);
        console.log(selectedOption);
        setCurrentPage(1)
    };

    useEffect(()=>{
        if(grid === 12){
            setItemsPerPage(4)
        }else{
            setItemsPerPage(6)
        }
    },[grid])


    
    return (
        <section className='w-full  flex flex-col items-center justify-center'>
            <div className='w-full relative breadcrumb-bg-2'>
                <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                    <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                        <div className='flex flex-wrap w-full'>
                            <div className='w-full flex flex-col gap-3 items-center justify-center'>
                                <h2 className='text-4xl font-bold text-black'>Services</h2>
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
                                <p className=' text-gray-600'>Services</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            
            </div>
                <div className="grid w-full py-20 grid-cols-12 gap-4 max-w-7xl mx-auto">
                    <div className="lg:col-span-3 mt-12 w-full col-span-12  lg:flex flex-col gap-4">
                        <div className='w-full bg-white shadow rounded-lg p-4 gap-5 flex flex-col divide-y-1 divide-gray-200'>
                            <div className='flex justify-between pb-2'>
                            <h3 className="text-xl font-bold">Filters</h3>
                            <p className="text-sm">Reset Filters</p>
                            </div>

                            <div className='flex flex-col gap-3 pb-4'>
                                <p className="text-sm">Keyword</p>
                                <CustomInput
                                placeholder={"What are you looking for?"}
                                title={""} required={false}
                                type='text' labelFor='n'
                                name='keyword' value={''}
                                labelBg={''}
                                disabled={false}
                                readOnly={false} 
                                onChange={() => {}}
                                />
                            </div>

                            <div className='flex flex-col gap-3 pb-2'>
                                <p className="text-xl text-gray-900 font-bold">Location</p>
                                <CustomInput
                                onChange={() => {}}
                                disabled={false}
                                readOnly={false}
                                placeholder={"Location"} title={""} required={false} type='text' labelFor='n' name='keyword' value={''} labelBg={''} />
                            </div>

                            <div className='flex flex-col gap-3 pb-2'>
                                <p className="text-xl text-gray-900 font-bold">Select Category</p>
                                <CustomSelect categories={[]} selectedCategory={null} onChange={function (): void {
                                throw new Error('Function not implemented.');
                            } }                                    
                                />
                            </div>
                            
                            <button className='bg-gray-800 cursor-pointer text-white hover:bg-black transition transform duration-200 w-full py-2 px-3 flex rounded-md justify-center'>Submit</button>
                        </div>
                    </div>
                                
                    

                    

                    <div  className={`lg:col-span-9  col-span-12 p-2  relative`}>
                        <div className="flex w-full md:flex-row flex-col bg-white p-3 mb-4  justify-between gap-3 items-center">
                            <div className='w-full text-2xl font-bold'>
                            Found <span className='text-teal-600'>{services?.total} Services</span>
                            </div>
                            <div className='w-full flex items-center justify-center'>
                                <div className="relative inline-block text-left">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center justify-start border border-gray-300 w-44 px-3 py-2.5 text-sm font-medium text-gray-900 bg-white  rounded-lg  focus:outline-none "
                                        type="button"
                                    >
                                        {selectedOption}
                                    </button>

                                    {isOpen && (
                                        
                                        <div className={`absolute left-0 z-10 custom-scrollbar right-0 bg-white border border-t-0 border-gray-800 rounded-sm -scroll-m-8 max-h-48 overflow-y-scroll ${isOpen ? 'block' : 'hidden'}`}>
                                            <ul className="bg-white text-sm  rounded-lg cursor-pointer">
                                                {options.map((op, i) => (
                                                    <li key={i}>
                                                        <button
                                                            onClick={() => selectOption(op.label)}
                                                            className="flex items-center w-full p-2 rounded hover:bg-teal-500 text-left"
                                                        >
                                                            <span className="ml-2">{op.label}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center  rounded gap-3">
                                    
                                    <div className=" gap-3 flex  py-2 px-3 rounded items-center cursor-pointer">
                                        {/* <svg width={20} height={20} viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"  fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>grid</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set"  transform="translate(-102.000000, -933.000000)" fill="#000000"> <path d="M128,941 C128,942.104 127.104,943 126,943 L122,943 C120.896,943 120,942.104 120,941 L120,937 C120,935.896 120.896,935 122,935 L126,935 C127.104,935 128,935.896 128,937 L128,941 L128,941 Z M126,933 L122,933 C119.791,933 118,934.791 118,937 L118,941 C118,943.209 119.791,945 122,945 L126,945 C128.209,945 130,943.209 130,941 L130,937 C130,934.791 128.209,933 126,933 L126,933 Z M128,957 C128,958.104 127.104,959 126,959 L122,959 C120.896,959 120,958.104 120,957 L120,953 C120,951.896 120.896,951 122,951 L126,951 C127.104,951 128,951.896 128,953 L128,957 L128,957 Z M126,949 L122,949 C119.791,949 118,950.791 118,953 L118,957 C118,959.209 119.791,961 122,961 L126,961 C128.209,961 130,959.209 130,957 L130,953 C130,950.791 128.209,949 126,949 L126,949 Z M112,941 C112,942.104 111.104,943 110,943 L106,943 C104.896,943 104,942.104 104,941 L104,937 C104,935.896 104.896,935 106,935 L110,935 C111.104,935 112,935.896 112,937 L112,941 L112,941 Z M110,933 L106,933 C103.791,933 102,934.791 102,937 L102,941 C102,943.209 103.791,945 106,945 L110,945 C112.209,945 114,943.209 114,941 L114,937 C114,934.791 112.209,933 110,933 L110,933 Z M112,957 C112,958.104 111.104,959 110,959 L106,959 C104.896,959 104,958.104 104,957 L104,953 C104,951.896 104.896,951 106,951 L110,951 C111.104,951 112,951.896 112,953 L112,957 L112,957 Z M110,949 L106,949 C103.791,949 102,950.791 102,953 L102,957 C102,959.209 103.791,961 106,961 L110,961 C112.209,961 114,959.209 114,957 L114,953 C114,950.791 112.209,949 110,949 L110,949 Z" id="grid" > </path> </g> </g> </g></svg> */}
                                        <button onClick={()=>{setGrid(4)}}  className={`p-2 ${grid===4 && "bg-teal-500"} border hover:bg-teal-500 border-gray-200 rounded-sm`}>
                                            {grid===12 ? <svg
                                            
                                            width={16}
                                            height={16}
                                                viewBox="0 0 28 28"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                // xmlnsSketch="http://www.bohemiancoding.com/sketch/ns"
                                                fill="#000000"
                                                >
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <defs></defs>
                                                    <g
                                                    id="Page-1"
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                    // sketchType="MSPage"
                                                    >
                                                    <g
                                                        id="Icon-Set"
                                                        // sketchType="MSLayerGroup"
                                                        transform="translate(-102.000000, -933.000000)"
                                                        fill="#000000"
                                                    >
                                                        <path
                                                        d="M128,941 C128,942.104 127.104,943 126,943 L122,943 C120.896,943 120,942.104 120,941 L120,937 C120,935.896 120.896,935 122,935 L126,935 C127.104,935 128,935.896 128,937 L128,941 L128,941 Z M126,933 L122,933 C119.791,933 118,934.791 118,937 L118,941 C118,943.209 119.791,945 122,945 L126,945 C128.209,945 130,943.209 130,941 L130,937 C130,934.791 128.209,933 126,933 L126,933 Z M128,957 C128,958.104 127.104,959 126,959 L122,959 C120.896,959 120,958.104 120,957 L120,953 C120,951.896 120.896,951 122,951 L126,951 C127.104,951 128,951.896 128,953 L128,957 L128,957 Z M126,949 L122,949 C119.791,949 118,950.791 118,953 L118,957 C118,959.209 119.791,961 122,961 L126,961 C128.209,961 130,959.209 130,957 L130,953 C130,950.791 128.209,949 126,949 L126,949 Z M112,941 C112,942.104 111.104,943 110,943 L106,943 C104.896,943 104,942.104 104,941 L104,937 C104,935.896 104.896,935 106,935 L110,935 C111.104,935 112,935.896 112,937 L112,941 L112,941 Z M110,933 L106,933 C103.791,933 102,934.791 102,937 L102,941 C102,943.209 103.791,945 106,945 L110,945 C112.209,945 114,943.209 114,941 L114,937 C114,934.791 112.209,933 110,933 L110,933 Z M112,957 C112,958.104 111.104,959 110,959 L106,959 C104.896,959 104,958.104 104,957 L104,953 C104,951.896 104.896,951 106,951 L110,951 C111.104,951 112,951.896 112,953 L112,957 L112,957 Z M110,949 L106,949 C103.791,949 102,950.791 102,953 L102,957 C102,959.209 103.791,961 106,961 L110,961 C112.209,961 114,959.209 114,957 L114,953 C114,950.791 112.209,949 110,949 L110,949 Z"
                                                        id="grid"
                                                        
                                                        // sketchType="MSShapeGroup"
                                                        ></path>
                                                    </g>
                                                    </g>
                                                </g>
                                            </svg>: <svg
                                                         width={16}
                                                         height={16}
                                                        viewBox="0 0 28 28" fill="none" stroke="#000000">
                                                        <g id="SVGRepo_iconCarrier">
                                                        <title>grid</title>
                                                        <desc>Created with Sketch Beta.</desc>
                                                        <defs></defs>
                                                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <g id="Icon-Set" transform="translate(-102.000000, -933.000000)" fill="#ffffff">
                                                            <path
                                                                d="M128,941 C128,942.104 127.104,943 126,943 L122,943 C120.896,943 120,942.104 120,941 L120,937 C120,935.896 120.896,935 122,935 L126,935 C127.104,935 128,935.896 128,937 L128,941 L128,941 Z M126,933 L122,933 C119.791,933 118,934.791 118,937 L118,941 C118,943.209 119.791,945 122,945 L126,945 C128.209,945 130,943.209 130,941 L130,937 C130,934.791 128.209,933 126,933 L126,933 Z M128,957 C128,958.104 127.104,959 126,959 L122,959 C120.896,959 120,958.104 120,957 L120,953 C120,951.896 120.896,951 122,951 L126,951 C127.104,951 128,951.896 128,953 L128,957 L128,957 Z M126,949 L122,949 C119.791,949 118,950.791 118,953 L118,957 C118,959.209 119.791,961 122,961 L126,961 C128.209,961 130,959.209 130,957 L130,953 C130,950.791 128.209,949 126,949 L126,949 Z M112,941 C112,942.104 111.104,943 110,943 L106,943 C104.896,943 104,942.104 104,941 L104,937 C104,935.896 104.896,935 106,935 L110,935 C111.104,935 112,935.896 112,937 L112,941 L112,941 Z M110,933 L106,933 C103.791,933 102,934.791 102,937 L102,941 C102,943.209 103.791,945 106,945 L110,945 C112.209,945 114,943.209 114,941 L114,937 C114,934.791 112.209,933 110,933 L110,933 Z M112,957 C112,958.104 111.104,959 110,959 L106,959 C104.896,959 104,958.104 104,957 L104,953 C104,951.896 104.896,951 106,951 L110,951 C111.104,951 112,951.896 112,953 L112,957 L112,957 Z M110,949 L106,949 C103.791,949 102,950.791 102,953 L102,957 C102,959.209 103.791,961 106,961 L110,961 C112.209,961 114,959.209 114,957 L114,953 C114,950.791 112.209,949 110,949 L110,949 Z"
                                                                id="grid"
                                                            />
                                                            </g>
                                                        </g>
                                                        </g>
                                                    </svg>}
                                        </button>

                                        <button onClick={()=>{setGrid(12)}}   className={`p-2 ${grid===12 && "bg-teal-500"} border hover:bg-teal-500 border-gray-200 rounded-sm`}>
                                            <svg viewBox="0 0 24 24"
                                            
                                            width={16}
                                            height={16}
                                            fill="">
                                                <g id="SVGRepo_iconCarrier">
                                                <path 
                                                    d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z" 
                                                    stroke={`${grid===4 ? "#000000":"#ffffff"}`} 
                                                    strokeWidth="2" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                />
                                                </g>
                                            </svg>
                                        </button>

                                        {/* <FaThList
                                            className='hover:scale-110 hover:text-yellow-800 '
                                            alt=""
                                            onClick={() => { changeGrid(12) }}
                                        />  */}
                                    </div>
                                </div>
                            </div>
                        </div>

                                                            {/* {isLoading && (
                                                            <div className="col-span-9">
                                                                <Loader />
                                                            </div>
                                                        )} */}
                       
                            <div className="grid grid-cols-12 gap-6">
                            {serviceArray?.map((service, index) => {
                                return <ServiceCard service={service} key={index} col={grid } />
                            })}
                                  
                                
                                
                            </div>
                        
                                                            
                            {/* <div className="flex col-span-9 h-screen gap-3  flex-col items-center justify-center  p-4 text-center">
                                <p className='text-7xl bounce-animation'>
                                😔
                                </p>
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h2>
                                <p className="text-gray-500">We couldn&apos;t find any products matching your search criteria. Please try again with different keywords or filters.</p>
                            </div> */}
                                                       
                        <div className="mt-5 d-flex align-items-center justify-center">
                            <nav className='absolute right-0 -bottom-5'>
                                <ul className="inline-flex -space-x-px text-sm font-semibold">
                                    <li>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`flex items-center hover:bg-pink-100 ${currentPage === 1 ? "bg-teal-100" : "bg-gray-50 text-teal-600 border border-gray-300"} justify-center px-3 h-8 ms-0 leading-tight text-teal-600 border border-e-0 border-gray-300 rounded-s-lg`}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`flex items-center justify-center px-3  h-8 hover:bg-pink-100 hover:text-teal-600 leading-tight ${currentPage === index + 1 ? 'text-teal-600 border border-gray-300 bg-teal-100 ' : 'text-teal-600 border border-gray-300 '}`}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === 5}
                                            className={`flex items-center hover:bg-pink-100 justify-center px-3 h-8 leading-tight rounded-e-lg ${currentPage === 5 ? "bg-teal-100" : "bg-gray-50 text-teal-600 border border-gray-300"}`}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    
                </div>
        </section>
    );
};

export default Services;
