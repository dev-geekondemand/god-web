import { Service } from '@/interfaces/Service';
import Image from 'next/image'
import Link from 'next/link'

const ServiceCard = (props: { col: number; service: Service }) => {
    const {col,service} = props;

     const azureLoader = ({ src }:{src:string}) => src;
    
  return (
    <div className={`${col===4 ?  "col-span-4 rounded-b-xl pb-4" : "col-span-12 rounded-md p-4"}  relative grid grid-cols-6 w-full  border border-gray-200 bg-white  `} >
    <Link 
        href={`/services/${service?._id}`}
         className={`flex  ${col===4 || col===6 ? "flex-col col-span-6" : "md:flex-row flex-col col-span-6 md:col-span-4"} w-full gap-5`}
         >
        <div className={`w-full flex gap-4 ${col===4 ? "flex-col":"flex-col sm:flex-row items-center"}`}>
           
            <Image 
            
            loader={azureLoader}
            width={col===4 ? 320 : 220} 
            height={140} 
            className={`${col===4 ? "" : "rounded-lg"}`}  
            src={service?.category?.image?.url ||  "/assets/images/blogImg.jpg"} alt="Service Image" />
            
            
            <div className="md:pl-4  flex flex-col gap-2 items-center sm:items-start justify-start">
                <h6 className={`bg-gray-300 px-4 text-sm text-teal-600 rounded-sm py-0.5 font-semibold ${col===4 ? "hidden" : "block"}`}>{service?.category?.title}</h6>
                <p className="text-xl font-bold hover:text-teal-600 text-center sm:text-start text-gray-800">{service?.title}</p>
                <p className="text-gray-600">{service?.createdBy?.address?.city + ", " + service?.createdBy?.address?.state}</p>
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

    
    <div className={`w-full mt-2 flex  ${col==4 ? "col-span-6  pl-4" : "col-span-6 justify-center md:col-span-2"}`}>
    <div className='flex w-full items-center md:justify-start justify-center'>
        <h6 className="font-bold text-2xl">₹{service?.price}.00</h6>
    </div>

    <div className='flex w-full h-full items-center justify-center'>
        <button className='bg-gray-200 text-sm rounded-md w-fit h-fit font-normal px-4 py-2'>
            Book Now
        </button>
    </div>
    </div>
   </div>
  )
}

export default ServiceCard
