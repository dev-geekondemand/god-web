"use client"
import Image from 'next/image';
import React from 'react'
import Link from 'next/link';
import toast from 'react-hot-toast';

const Footer = () => {

    const footerLinks = [
        {
          category: "Categories",
          links: [
            {
              text: "Laptops - Service & Repair",
              url: "/categories/682af19ccd7ba362b7afbb02/brands"
            },
            {
              text: "Printer - Service & Repair",
              url: "/categories/682af362cd7ba362b7afbb28/brands"
            },
            {
              text: "Scanner - Service & Repair",
              url: "/categories/682af380cd7ba362b7afbb30/brands"
            },
            {
              text: "Router - Service & Repair",
              url: "/categories/682af36fcd7ba362b7afbb2c"
            },
            {
              text: "Email - Service & Repair",
              url: "/categories/682af32fcd7ba362b7afbb1e/brands"
            },
            {
              text: "View All Categories",
              url: "/service-categories"
            }
          ]
        },
        {
          category: "Information",
          links: [
            {
              text: "About GeekOnDemand",
              url: "/about"
            },
            {
              text: "Founder's Message",
              url: "/founders-message"
            },
            {
              text: "Blogs",
              url: "/blogs"
            },
            {
              text: "FAQ'S",
              url: "/faqs"
            },
            {
              text: "Contact Us",
              url: "/contact"
            }
          ]
        },
        {
          category: "GOD Terms and Conditions",
          links: [
            {
              text: "Terms of Service",
              url: "/terms-and-conditions"
            },
            {
              text: "Privacy Policy",
              url: "/privacy-policy"
            },
            {
              text: "Refund and Cancellation Policy",
              url: "/refund-and-cancellation-policy"
            }
          ]
        }
      ];

      const socialLinks = [
        {
          platform: "Facebook",
          url:"https://www.facebook.com/geekondemand",
          icon: "/assets/icons/fb.svg"
        },
        {
          platform: "Instagram",
          url:"https://www.instagram.com/geekondemandpvtltd/",
          icon: "/assets/icons/instagram.svg"
        },
        {
          platform: "Twitter",
          url:" https://x.com/GeekOnDemandin",
          icon: "/assets/icons/twitter.svg"
        },
        // {
        //   platform: "WhatsApp",
        //   url:"",
        //   icon: "/assets/icons/whatsapp.svg"
        // },
        {
          platform: "YouTube",
          url:"https://www.youtube.com/@GeekOnDemandService",
          icon: "/assets/icons/youtube.svg"
        },
        {
          platform: "LinkedIn",
          url:"https://www.linkedin.com/company/geekondemand-pvt-ltd/about/?viewAsMember=true",
          icon: "/assets/icons/linkedin.svg"
        }
      ];

      const [email, setEmail] = React.useState<string>("");
      const [error, setError] = React.useState<string>("");

      const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if(error){
            setError("");
        }
      }

      const handleNewsLetter = async () => {
        setError("");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address.");
          return;
        }
        
          toast.success("Subscribed to newsletter successfully");
          setEmail("");
        } 
      
      
      
  return (
    <footer className='w-full bg-gray-100 flex justify-center py-8'>
        <div className='w-full lg:px-20 px-6'>
            <div className='grid grid-cols-12 justify-start items-start'>
                <div className="md:col-span-8 col-span-12 w-full grid md:grid-cols-3 grid-cols-2 gap-6">
                    {footerLinks?.map((cat,i)=>{
                        return <div key={i+1} className='flex flex-col gap-3'>
                            <h2 className="h5">{cat.category}</h2>
                                <ul className='flex flex-col gap-3 justify-center'>
                                    {cat?.links?.map((link,i)=>{
                                        return <li key={100+i}>
                                            <a className='text-gray-600 text-sm md:text-base' href={link.url}>{link.text}</a>
                                        </li>
                                    })}
                                </ul>
                        </div>
                    })}
                </div>

                <div className='md:ml-4 mt-6 w-full md:col-span-4 col-span-12 flex flex-col gap-4'>
                <div className='w-full mb-3 px-5 py-4 bg-gray-50 shadow rounded-md  flex flex-col gap-4'>
                    <h3 className="font-semibold text-xl">Sign Up for NewsLetter</h3>
                    <input value={email} onChange={onEmailChange} type="text" placeholder='Enter your Email' className='w-full bg-white text-sm font-normal text-gray-700 outline-none border border-gray-300 px-4 py-3 rounded-sm' />
                <button 
                    onClick={()=>{handleNewsLetter()}} 
                    className="flex justify-center  w-full text-nowrap cursor-pointer gap-1 px-8 py-1.5 bg-teal-700 text-base text-white rounded-md"
                    >
                        Subscribe
                        
                    </button>
                    {error && <div className='text-sm text-red-500'>{error}</div>}
                </div>

                    <div className='flex flex-wrap w-full gap-3 mb-2'>
                        <h6 className="text-sm font-bold">Download our App:</h6>
                        <div className='flex gap-3 lg:flex-row flex-col'>
                          <Link href={"https://tinyurl.com/GEEKDM/"} target='_blank' className='me-2'>
                        <Image src={"/assets/images/goolge-play.svg"} width={120} height={50} alt='google play' />
                        </Link>
                        <Link href={"https://tinyurl.com/GEEKND/"}>
                        <Image src={"/assets/images/app-store.svg"} width={120} height={50} alt='app store' />
                        </Link>
                        </div>
                    </div>
                </div>

            </div>

            <ul className="mt-6 flex flex-wrap space-x-4">
                {socialLinks.map((link, index) => (
                    <li key={index}>
                    <a href={link.url} className='' target="_blank" rel="noopener noreferrer">
                        <Image 
                        src={link.icon} 
                        alt={`${link.platform} icon`} 
                        width={24} 
                        height={24} 
                        className="hover:rotate-y-360 transition transform duration-500"
                        />
                    </a>
                    </li>
                ))}
                </ul>

        </div>
      
    </footer>
  )
}

export default Footer
