import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CircleCheck, MousePointer, Sparkle, UserSearch } from 'lucide-react'


const page = () => {

  // const Team = [
  //   {
  //     name:"Abhay Pratap",
  //     role:"Tech Lead",
  //     image:"/assets/images/about/provider-2.jpg",
  //     linkedIn:"",
  //     instagram:"",
  //     twitter:"",
  //     website:""
  //   },
  //   {
  //     name:"Jennifer Crystals",
  //     role:"Cyber Security",
  //     image:"/assets/images/about/provider-1.jpg",
  //     linkedIn:"",
  //     instagram:"",
  //     twitter:"",
  //     website:""
  //   },
  //   {
  //     name:"Mike Ross",
  //     role:"Marketing Lead",
  //     image:"/assets/images/about/provider-2.jpg",
  //     linkedIn:"",
  //     instagram:"",
  //     twitter:"",
  //     website:""
  //   },
  //   {
  //     name:"Ariana Matthers",
  //     role:"Human Resources",
  //     image:"/assets/images/about/provider-1.jpg",
  //     linkedIn:"",
  //     instagram:"",
  //     twitter:"",
  //     website:""
  //   },
  // ]

  const Testimonials= [
    {
      id:101,
      image:"/assets/images/about/provider-1.jpg",
      name:"AI-Powered Diagnostics & Triage:",
      content:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis voluptatibus soluta sint tenetur obcaecati expedita in iure culpa adipisci voluptas quibusdam, saepe et accusamus facere officiis non error quia eligendi?",
      role:"Small Buisness Owner",
      list:[
        "	Automatically identifies issues across hardware, software, and networks.",
        "Troubleshoots and resolves common problems in real-time.",
        "Routes complex cases directly to the right GeekOnDemand tech professional for quick escalation."

      ]
    },
    {
      id:102,
      image:"/assets/images/about/provider-1.jpg",
      name:"Real-Time Multi-Channel Support",
      content:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis voluptatibus soluta sint tenetur obcaecati expedita in iure culpa adipisci voluptas quibusdam, saepe et accusamus facere officiis non error quia eligendi?",
      role:"Small Buisness Owner",
      list:[
          "	Access help through chat, voice, or video — anytime you need it.",
          "	Get instant resolution from GeekOnDemand IT services that combine AI insights with human expertise."
          ]

    },
    {
      id:103,
      image:"/assets/images/about/provider-1.jpg",
      name:"DIY Assistance & Smart Recommendations",
      content:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis voluptatibus soluta sint tenetur obcaecati expedita in iure culpa adipisci voluptas quibusdam, saepe et accusamus facere officiis non error quia eligendi?",
      role:"Small Buisness Owner",
      list:[
        "Follow step-by-step, AI-guided repair instructions for faster self-resolution.",
        "Use predictive fixes that prevent future issues, saving time and money."
      ]
    },
    {
      id:104,
      image:"/assets/images/about/provider-1.jpg",
      name:"End-to-End IT Lifecycle Management",
      content:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis voluptatibus soluta sint tenetur obcaecati expedita in iure culpa adipisci voluptas quibusdam, saepe et accusamus facere officiis non error quia eligendi?",
      role:"Small Buisness Owner",
      list:[
        "Monitor the health of your hardware and software.",
"Receive cost-effective upgrade recommendations before problems occur.",
"Keep your business running smoothly with proactive maintenance.",

      ]
    },

  ]

  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <div className='w-full relative breadcrumb-bg-2'>
        <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
            <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                <div className='flex flex-wrap w-full'>
                    <div className='w-full flex flex-col gap-3 items-center justify-center'>
                        <h2 className='text-4xl font-bold text-black'>About Us</h2>
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
                          <p className=' text-gray-600'>About Us</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      
    </div>

    <div className='w-full md:pt-20 py-6 md:mt-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2'>
        <div className='flex items-center justify-center relative lg:justify-start p-3'>
          <div className='md:block hidden w-[370px] md:h-[400px] xl:h-[500px] relative bg-gray-900 rounded-lg p-2'>
            <span className='-rotate-90 absolute top-1/2 md:-left-23 xl:-left-19 inline-block text-white text-xl font-semibold'>12+ Years of Experience</span>
          </div>

            <div className='md:absolute relative w-[95%] h-[400px] md:w-[340px] md:h-[350px] xl:w-[470px] xl:h-[470px] top-7 xl:left-1/7 lg:left-1/4 md:left-1/7'>
              <Image className='rounded-lg' src="/assets/images/about/about-01.png" layout='fill' alt="about us image" />
            </div>
        </div>

        <div className='w-full p-4 md:px-8 lg:px-4 mt-8 flex flex-col gap-5'>
          <div className='flex flex-col '>
            <h5 className="h6 text-gray-600">Simplifying IT Support with Talent You Can Trust</h5>
            <h3 className="h5">Your Trusted Partner for IT Solutions – 24/7, Anywhere in the World</h3>
          </div>
          <div className='flex  flex-col gap-6'>
            <p className="text-sm leading-5.5 md:leading-6 text-gray-700">
            In today’s fast-moving digital world, businesses can’t afford downtime. Whether you are running a startup, a growing MSME, or an established enterprise, technology is at the core of everything you do. At <b>GeekOnDemand</b>, we make sure your technology always works for you.
            </p>
            <p className="text-sm leading-5.5 md:leading-6 text-gray-700">
              Born from the idea that IT support should be hassle-free, transparent, and reliable, GeekOnDemand connects you with expert IT professionals in India who solve everything from laptop repair in Hyderabad to server support, cloud solutions, and cybersecurity services across India — all at your fingertips.
            </p>
            <p className="text-sm leading-5.5 md:leading-6 text-gray-700">Our platform offers <b>on-demand IT services in India</b>, with <b>24/7 tech support</b> that’s available anytime, anywhere. No middlemen. No hidden fees. Just <b>direct access to skilled GeekOnDemand tech professionals</b> who care about solving your problems quickly and efficiently.</p>
          </div>

          {/* <ul className='w-full grid grid-cols-2 mt-6 space-x-3 space-y-5 text-gray-700 text-sm'>
            <li className='flex items-start gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />
            We prioritize quality and reliability 
            </li>
            <li className='flex items-start gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />
            We Saving your time and effort.
            </li>
            <li className='flex items-start gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />
            Clear, detailed service listings & reviews
            </li>
            <li className='flex items-start gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />
            Smooth and satisfactory experience.
            </li>
          </ul> */}
        </div>

    </div>

            <div className='flex flex-col md:flex-row bg-white w-full max-w-6xl mx-auto gap-20'>
          <section className='w-full  py-20 flex justify-center items-center'>
            <div className='max-w-7xl w-full mx-auto flex flex-col gap-10 px-6'>
              <h3 className='h3 text-gray-800 text-center'>Our Mission</h3>
              <ul className='flex flex-col gap-3 text-gray-700 text-sm leading-6 max-w-3xl mx-auto'>
                 <li className='flex items-center gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />To provide on-demand IT services in India that are fast, transparent, and accessible to all.</li>
                 <li className='flex items-center gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />To empower businesses — from MSMEs to enterprises — with GeekOnDemand IT services they can trust.</li>
                 <li className='flex items-center gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />To enable IT professionals in India to build successful careers, working commission-free with clients across the globe.</li>
              </ul>
            </div>
          </section>

          {/* Our Vision Section */}
          <section className='w-full flex justify-center items-center'>
            <div className='max-w-7xl w-full mx-auto flex flex-col gap-6 px-6'>
              <h3 className='h3 text-gray-800 text-center'>Our Vision</h3>
              <p className='text-sm text-gray-600 text-center max-w-4xl mx-auto'>
                GeekOnDemand was founded by technology industry veterans who understand the pain points of traditional outsourcing. 
              </p>

              <ul className='flex flex-col gap-3 text-gray-700 text-sm leading-6 max-w-3xl mx-auto'>
                <li className='flex items-center gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />Tech support is available anytime, anywhere.</li>
                <li className='flex items-center gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' />MSMEs and startups can access enterprise-level IT help without high costs.</li>
                <li className='flex items-center gap-2'><Image className='mt-0.5' width={16} height={16} src={"/assets/icons/check-circle.svg"} alt='check image' /> IT professionals in India get the recognition, exposure, and opportunities they deserve.</li>
              </ul>
            </div>
          </section>
        </div>



    {/* Who We Are Section */}
    <div className='w-full bg-gray-50 py-20'>
      <div className='max-w-7xl w-full mx-auto px-6 flex flex-col gap-10'>
        
        {/* Section Heading */}
        <div className='text-center flex flex-col gap-3 items-center justify-center'>
          <h3 className='h2 text-gray-800'>Who We Are</h3>
          <p className='body-2 text-gray-600 max-w-3xl'>
            GeekOnDemand is a pioneering IT support marketplace in Hyderabad — but our reach goes far beyond. 
            We bring together a nationwide network of IT professionals in India who can solve problems big and small, locally or remotely.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x-2 divide-gray-400  items-start'>
          
          {/* For Seekers */}
          <div className=' px-8  flex flex-col gap-4 '>
            <h4 className='h4 text-gray-800 flex items-center gap-2'>
              <span className='text-teal-600 text-lg'>For Seekers</span> (Businesses & Individuals)
            </h4>
            <ul className='flex flex-col gap-3 text-sm text-gray-700 leading-6'>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Post your IT requirements in minutes.
              </li>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Hire trusted IT service providers in Hyderabad and beyond.
              </li>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Get instant help with laptop repair, network setup, cloud migration, cybersecurity audits, and more.
              </li>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Enjoy complete transparency with no commissions or middlemen inflating costs.
              </li>
            </ul>
          </div>

          {/* For Geeks */}
          <div className=' px-8  flex flex-col gap-4  '>
            <h4 className='h4 text-gray-800 flex items-center gap-2'>
              <span className='text-teal-600 text-lg'>For Geeks</span> (IT Professionals)
            </h4>
            <ul className='flex flex-col gap-3 text-sm text-gray-700 leading-6'>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Build your profile and showcase your skills.
              </li>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Access IT career opportunities in India and work directly with global clients.
              </li>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Get paid fairly with zero platform commissions.
              </li>
              <li className='flex items-start gap-2'>
                <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check' />
                Be part of a growing community that values talent and credibility.
              </li>
            </ul>
          </div>
        </div>

        {/* Closing Line */}
        <div className='text-center mt-6'>
          <p className='body-2 text-gray-700 max-w-3xl mx-auto'>
            With <b>GeekOnDemand Hyderabad</b> and our national reach, we make remote IT support in India 
            easier, faster, and smarter for everyone.
          </p>
        </div>
        






      </div>
    </div>






    
    <div className='w-full bg-[#f7f7ff] py-20 relative'>
      <div className='w-full max-w-7xl mx-auto flex flex-col justify-center items-center gap-8'>
          <div className='flex flex-col gap-4 items-center justify-center'>
              <h3 className="h2">How It Works</h3>
              <p className="body-2 text-center text-gray-700">Straightforward process designed to make your experience seamless and hassle-free.</p>
          </div>
          <div className='w-full flex flex-col lg:flex-row justify-center items-center gap-7  p-4'>

              <div className='bg-white px-4 py-6 rounded-lg flex flex-col items-center gap-4 relative '>
                <div className='w-20 h-20 rounded-lg flex items-center justify-center bg-teal-100/70'>
                <UserSearch width={40} height={40} className='text-teal-500' />

                </div>
                  <div className='flex flex-col md:w-sm items-center gap-2'>
                      <h4 className="h5">1. Search and Browse</h4>
                      <p className="text-sm text-center px-3 leading-6 text-gray-500">
                        Customers can browse or search for specific Services or Geeks using categories, filters, or search bars.
                      </p>

                  </div>

                  {/* <div className='absolute -top-3 -left-2 text-6xl font-bold border-teal-200'>
                      01
                  </div> */}
              </div>

              <div className='bg-white px-4 py-6 rounded-lg flex flex-col items-center gap-4 relative '>
                <div className='w-20 h-20 rounded-lg flex items-center justify-center bg-teal-100/70'>
                <MousePointer width={40} height={40} className='text-teal-600' />
                </div>
                  <div className='flex flex-col md:w-sm items-center gap-2'>
                      <h4 className="h5">2. Book Service</h4>
                      <p className="text-sm text-center leading-6 px-3 text-gray-500">
                      Register with us in a few simple steps. Hire and work directly with Tech Support Geeks.
                      </p>

                  </div>

                  {/* <div className='absolute -top-3 -left-2 text-6xl font-bold border-teal-200'>
                      02
                  </div> */}
              </div>


              <div className='bg-white px-4 py-6 rounded-lg flex flex-col items-center gap-4 relative '>
                <div className='w-20 h-20 rounded-lg flex items-center justify-center bg-teal-100/70'>
                <Sparkle width={40} height={40} className='text-teal-600' />

                </div>
                  <div className='flex flex-col md:w-sm items-center gap-2'>
                      <h4 className="h5">3. Solve Problems</h4>
                      <p className="text-sm px-3 text-center leading-6 text-gray-500">
                      Choose the best quotation from expert Geeks and collaborate with them across diverse IT support categories.
                      </p>

                  </div>

                  {/* <div className='absolute -top-3 -left-2 text-6xl font-bold border-teal-200'>
                      03
                  </div> */}
              </div>

              
              
          </div>
      </div>
    </div>


    <div id='faq' className='w-full sm:p-5 p-3 bg-gray-50/60 py-20 flex flex-col justify-center items-center'>
      <div className='w-full max-w-7xl mx-auto grid grid-cols-12 gap-6 justify-center items-center'>
          <div className='col-span-12 md:col-span-6 flex flex-col gap-6'>
            <h1 className="h2">Why Choose Geek On Demand?</h1>
            <p className="body-2 text-gray-600">India’s First Zero-Commission Tech Support Marketplace.</p>
            <Accordion type="single" collapsible className="w-full mt-2 text-base flex flex-col gap-2">
            <AccordionItem value="item-1" className='border-b-0'>
              <AccordionTrigger className='text-base bg-gray-100 rounded-lg px-3 mb-1'>Verified, Skilled & Trusted Geeks.</AccordionTrigger>
              <AccordionContent className='bg-white px-3 text-gray-700'>
             Every Geek goes through background checks, skill evaluation, and continuous performance monitoring — ensuring customers get reliable, high-quality tech support every time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className='border-b-0'>
              <AccordionTrigger className='text-base bg-gray-100 rounded-lg px-3 mb-1'>Zero Commission Model – 100% Earnings to Geeks</AccordionTrigger>
              <AccordionContent className='bg-white px-3 text-gray-700'>
              GeekOnDemand does not take any commission from the Geek’s earnings.
                This ensures:
                <ul className='flex flex-col gap-1 mt-1'>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Better pricing for customers</li>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Higher income for Geeks</li>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Stronger trust and long-term relationships</li>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Stronger trust and long-term relationships</li>
                </ul>

              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className='border-b-0'>
              <AccordionTrigger className='text-base bg-gray-100 rounded-lg px-3 mb-1'>End-to-End Tech Support Under One Roof</AccordionTrigger>
              <AccordionContent className='bg-white px-3 text-gray-700'>
              Hardware, software, networking, cybersecurity, servers, cloud, email, OS, antivirus, Wi-Fi, CCTV, routers, printers — everything.
              <span className='font-bold'>   One Platform. One trusted Expert.</span>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className='border-b-0'>
              <AccordionTrigger className='text-base bg-gray-100 rounded-lg px-3 mb-1'>Pan-India Availability</AccordionTrigger>
              <AccordionContent className='bg-white px-3 text-gray-700'>
              Whether it’s metros or Tier-2/Tier-3 cities, customers get access to tech experts anytime, anywhere.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className='border-b-0'>
              <AccordionTrigger className='text-base bg-gray-100 rounded-lg px-3 mb-1'>Post-Warranty Specialists</AccordionTrigger>
              <AccordionContent className='bg-white px-3 text-gray-700'>
              Most OEMs stop support after warranty. GeekOnDemand fills this critical gap by offering affordable, reliable, fast post-warranty tech services.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className='border-b-0'>
              <AccordionTrigger className='text-base bg-gray-100 rounded-lg px-3 mb-1'>. Faster Response & Real-Time Tracking</AccordionTrigger>
              <AccordionContent className='bg-white px-3 text-gray-700'>
              From booking to completion:
              <ul className='flex flex-col gap-1 mt-1'>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Instant Geek assignment</li>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Live status tracking</li>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Service quality monitoring</li>
                <li className='flex items-start gap-2'><CircleCheck className='text-gray-950 mt-1' size={12} />Quick escalation and resolution</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          
          </Accordion>
          
          </div>

          <div className='col-span-12 md:col-span-6 relative '>
            <Image src={"/assets/images/about-page.jpeg"} alt='Service Image' width={350} height={350} className='w-full h-full' />
          </div>
          
      </div>

      {/* <div className='w-full max-w-7xl flex flex-wrap justify-center gap-3  mx-auto my-12 md:divide-x-1 divide-teal-500 divide-dotted'>

          <div className="group relative  justify-center cursor-pointer flex" >
              <div className="flex w-full items-center justify-start sm:px-5 md:mr-12">
                      <div className='w-[60px] h-[60px] relative'>
                                      <Users  className='w-14 h-14 text-teal-600' />

                          
                      </div>                            
                  <div className=' flex flex-col gap-2 items-start justify-center p-3'>
                      <p className='text-2xl font-bold text-gray-800'>2583+</p>
                  
                      <p className='font-normal block text-gray-700 text-sm'>Satisfied Clients</p>
                  </div>
                
              </div>
          </div>

          <div className="group relative px-10  justify-center cursor-pointer flex" >
              <div className="flex w-full items-center justify-start sm:px-5">
                      <div className='w-[60px] h-[60px] relative'>
                          <Image
                            layout="fill"
                            objectFit="cover"
                            className='object-cover' src={"assets/images/about/expert-team-1.svg"} alt='Category Image' />
                          
                      </div>                            
                  <div className=' flex flex-col gap-2 items-start justify-center p-3'>
                      <p className='text-2xl font-bold text-gray-800'>2583+</p>
                  
                      <p className='font-normal block text-gray-700 text-sm'>Satisfied Clients</p>
                  </div>
                
              </div>
          </div>

          <div className="group relative px-10  justify-center cursor-pointer flex" >
              <div className="flex w-full items-center justify-start sm:px-5">
                      <div className='w-[60px] h-[60px] relative'>
                          <Image
                            layout="fill"
                            objectFit="cover"
                            className='object-cover' src={"/assets/images/about/about-documents-1.svg"} alt='Category Image' />
                          
                      </div>                            
                  <div className=' flex flex-col gap-2 items-start justify-center p-3'>
                      <p className='text-2xl font-bold text-gray-800'>2583+</p>
                  
                      <p className='font-normal block text-gray-700 text-sm'>Satisfied Clients</p>
                  </div>
                
              </div>
          </div>

          <div className="group relative px-10  justify-center cursor-pointer flex" >
              <div className="flex w-full items-center justify-start sm:px-5">
                      <div className='w-[60px] h-[60px] relative'>
                          <Image
                            layout="fill"
                            objectFit="cover"
                            className='object-cover' src={"/assets/images/about/expereience.svg"} alt='Category Image' />
                          
                      </div>                            
                  <div className=' flex flex-col gap-2 items-start justify-center p-3'>
                      <p className='text-2xl font-bold text-gray-800'>2583+</p>
                  
                      <p className='font-normal block text-gray-700 text-sm'>Satisfied Clients</p>
                  </div>
                
              </div>
          </div>

      </div> */}
    </div>


    {/* <div className='w-full sm:p-5 p-3 bg-gray-50 flex justify-center py-12'>
      <div className="max-w-7xl w-full mx-auto gap-12 flex flex-col">
        <div className='flex  flex-col items-center gap-3'>
          <h5 className="text-gray-600 font-medium"></h5>
          <h2 className="h2 text-gray-800">Meet the Experts Behind the Platform</h2>
          <p className='text-gray-600 max-w-4xl text-center'>Our team is a tight-knit group of technologists, innovators, and problem-solvers committed to building a smarter future for IT support. Together, we ensure that every client and every Geek experiences a smooth, reliable, and rewarding journey on the GeekOnDemand platform</p>
        </div>

      <div className='w-full mb-12 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 gap-8'>
        {Team.map((t,i)=>{
          return <div key={i+1} className='flex flex-col   justify-center items-center bg-white gap-3 shadow-sm rounded-lg pt-4 p-6'>
           
           <Image src={t.image} alt='Team member Image' width={500} height={300} className='rounded-md' />
          

            <div className='w-full flex flex-col gap-1 px-2 pb-2'>
            <p className="text-lg text-gray-800 ">{t.name}</p>

                <div className='flex flex-col gap-2'>
                <p className='text-sm text-gray-500'>{t.role}</p>

                <div className='flex gap-2 items-center'>
                  <Image src={"/assets/icons/whatsapp.svg"} alt='Whatsapp' width={20} height={20} />
                  <Image src={"/assets/icons/website.svg"} alt='website' width={20} height={20} />
                  <Image src={"/assets/icons/linkedIn.svg"} alt='linkedIn' width={20} height={20} />
                  <Image src={"/assets/icons/twitter.svg"} alt='twitter' width={20} height={20} />

                </div>
                </div>
            </div>
          </div>
        })}

      </div>
      </div>  

    </div> */}







    <div className='w-full sm:p-5 p-3 md:pt-20 pt-10 bg-gray-50 flex justify-center py-12'>
      <div className="max-w-7xl w-full mx-auto gap-6 flex flex-col">
            <div className='text-center flex flex-col gap-3'>
              <h3 className='h2 text-gray-800'>Revolutionizing IT Support with AI</h3>
              <h4 className='h4 text-gray-600 font-semibold'>AI + Human Expertise = Better, Faster IT Support</h4>
              <p className='body-2 text-gray-600 max-w-4xl mx-auto'>
                GeekOnDemand goes beyond the traditional marketplace model by integrating AI-powered diagnostics, triage, 
                and self-help tools that work round-the-clock. Our <b>AI Twin Geek</b> is your always-available virtual technician.
              </p>
            </div>

        <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full py-6 px-5 "
                >
                <CarouselContent>
                    {Testimonials.map((t,index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 sm:basis-1/1 mx-2 my-1">
                        <Card className=' border-none shadow-none py-8 bg-transparent  '>
                            <CardContent className="flex bg-white relative shadow rounded-md py-5 flex-col group gap-2 items-start justify-start">
                                {/* <div className='   rounded-full mb-1'>
                                <Image src={t.image} alt='Testimonial Image' className='rounded-full absolute -top-8 left-1/2' width={90} height={90} />
                                </div> */}


                             
                              

                            <div className='flex flex-col gap-2 h-[280px] md:h-[150px] px-3'>
                                <h4 className='h5 text-gray-700'>{t.name}</h4>
                                <ul>
                                  {t.list.map((l,i)=>(
                                    <li key={i+1} className='flex items-center gap-2 text-sm text-gray-500 leading-6'>
                                      <CircleCheck width={16} className="mt-1 text-teal-600 flex-shrink-0" />
                                      {l}
                                    </li>
                                  ))}
                                </ul>
                            </div>

                            
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='cursor-pointer -left-3 hover:bg-teal-500 hover:text-white'/>
                <CarouselNext className='cursor-pointer -right-0 hover:bg-teal-500 hover:text-white' />
            </Carousel>

      </div>  

    </div>


    


        {/* What's Next Section */}
      <section className='w-full bg-white py-20 flex justify-center items-center'>
        <div className='max-w-7xl w-full mx-auto flex flex-col gap-10 px-6'>

          {/* Heading */}
          <div className='flex flex-col gap-4 text-center items-center justify-center'>
            <h3 className='h2 text-gray-800'>What’s Next for GeekOnDemand?</h3>
            <p className='body-2 text-gray-600 max-w-5xl'>
              We are just getting started. Our focus is on continuously improving the GeekOnDemand platform, adding AI-driven features, expanding our network of IT service providers in Hyderabad and across India, and creating more IT career opportunities for talented professionals.
            </p>
            <p className='body-2 text-gray-600 max-w-5xl'>
              <b>Our promise:</b> Whether you need cybersecurity services in India, cloud solutions in Hyderabad, or 24/7 remote IT support, <b>GeekOnDemand</b> will always be your trusted partner.
            </p>
          </div>

          <section className='w-full sm:p-5 p-3 flex items-center justify-center  relative z-1 py-20'>
              <div className='w-full max-w-5xl mx-auto grid grid-cols-12 rounded-lg justify-center items-center md:px-10   px-6 py-10 bg-gray-900 '>
                <div className='md:col-span-9 col-span-12 gap-6 flex text-white flex-col items-start justify-center'>
                  
                    <h1 className="h2">Take the Next Step</h1>
                    <ul className='flex flex-col gap-3 text-sm text-gray-700 leading-6'>
                    <li className='flex text-white items-start gap-2'>
                      <CircleCheck width={16} />
                      Find a faster resolution to your IT concerns — connect with a GeekOnDemand tech professional today.
                    </li>
                    <li className='flex text-white items-start gap-2'>
                      <CircleCheck width={16} />
                      Empower your business with smarter IT support — explore GeekOnDemand services right now.
                      </li>
                      </ul>

                      <div className='flex sm:flex-row flex-col flex-wrap items-center gap-4'>
                      <Link 
                        href="/register" 
                        className='bg-white text-gray-900 transition-all  rounded-lg text-sm px-6 py-2.5 shadow'>
                        Post Your IT Concern
                      </Link>
                      <Link 
                        href="/contact" 
                        className='border border-white text-white transition-all rounded-lg text-sm px-6 py-2 shadow'>
                        Contact Us
                      </Link>
                    </div>
                    </div>
                
                  <div className=' hidden md:block md:col-span-3   overflow-hidden'>
                  <Image src={"/assets/images/about/repair-img.png"} className='rounded-md hover:scale-105 transition transform duration-200' alt='How it works for geeks'width={400} height={300} />
                  </div>
                </div>

          </section>

          {/* Take the Next Step */}
          {/* <div className='w-full bg-[#f7f7ff] rounded-xl shadow-sm py-12 px-6 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex flex-col gap-4 max-w-2xl'>
              <h4 className='h4 text-gray-800'>Take the Next Step</h4>
              <ul className='flex flex-col gap-3 text-gray-700 text-sm leading-6'>
                <li className='flex items-start gap-2'>
                  <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check icon' />
                  Find a faster resolution to your IT concerns — connect with a GeekOnDemand tech professional today.
                </li>
                <li className='flex items-start gap-2'>
                  <Image src={"/assets/icons/check-circle.svg"} width={16} height={16} alt='check icon' />
                  Empower your business with smarter IT support — explore GeekOnDemand services right now.
                </li>
              </ul>
            </div>


            <div className='flex flex-col md:flex-row items-center gap-4'>
              <Link 
                href="/register" 
                className='bg-teal-500 hover:bg-pink-600 transition-all text-white rounded-lg text-sm px-6 py-3 shadow'>
                Post Your IT Concern
              </Link>
              <Link 
                href="/contact" 
                className='border border-teal-500 text-teal-600 hover:bg-pink-50 transition-all rounded-lg text-sm px-6 py-3 shadow'>
                Contact Us
              </Link>
            </div>
          </div> */}
        </div>
      </section>

      



    </section>
  )
}

export default page
