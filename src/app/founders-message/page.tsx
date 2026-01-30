import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FounderMessage = () => {
  return (
    <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
        <div className='w-full relative breadcrumb-bg-2 '>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-gray-100'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>Founder&apos;s Message</h2>
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
                                <p className=' text-gray-600'>Founder&apos;s Message</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
        </div>

        <div className='w-full flex flex-col py-10 '>
            <div className="max-w-6xl mx-auto sm:px-4 px-1  text-gray-800">

                <div className="bg-white p-4  rounded-md shadow-sm">
                    <div className='w-full h-[30vh] flex items-center rounded-md founder-bg border p-4 relative'>
                        <Image src="/assets/logo-big.webp" className='w-full h-full' width={300} height={200} alt="Founder" />
                            <div className='w-30 h-30  rounded-full border absolute -bottom-16 left-5 border-gray-300 bg-gray-50'>
                                <Image src="/assets/founder.jpg" className='w-30 h-30 rounded-full' width={200} height={200} alt="Founder" />
                            </div>
                            
                        
                    </div>
                   

                   <div className='w-full flex mt-12 flex-col gap-3 lg:p-6 p-3'>
                            <div className="flex flex-col gap-1 mb-2">
                                <p className="text-xl mb-0 font-semibold">Rajesh Gade</p>
                                <p className="text-gray-600 mb-0">Founder and CEO, GeekOnDemand</p>
                            </div>
                   <section className="mb-2">
                    <h2 className="text-2xl font-semibold mb-2">About the Founder</h2>
                    <p className="text-base leading-relaxed">
                        With over 35 years of dynamic experience in the Communication & IT and Life Sciences industries, I, Rajesh Gade, have had the privilege of contributing to transformative changes and innovations. Throughout my career, I have specialized in managing start-ups, strategic planning, business development, and mergers and acquisitions. My journey has been marked by a commitment to excellence, innovation, and the empowerment of professionals. I hold a PG Diploma in System Management and a B.A. from Osmania University. Additionally, I am a certified CRA, which has further enriched my expertise and ability to drive successful projects.
                    </p>
                    </section>

                    <section className="mb-2">
                    <h2 className="text-2xl font-semibold mb-2">The Inspiration Behind GeekOnDemand</h2>
                    <p className="text-base leading-relaxed">
                        The idea for GeekOnDemand emerged from my vision to bridge the gap between highly skilled Indian IT professionals and global clients in need of cutting-edge IT solutions. Witnessing the immense talent and potential within India, I recognized the need for a platform that could connect this talent with global opportunities. GeekOnDemand is India&apos;s first marketplace for IT infrastructure solutions, aiming to revolutionize the way the world connects with Indian IT talent.
                    </p>
                    </section>

                    <section className="mb-2">
                    <h2 className="text-2xl font-semibold mb-2">Opportunities for IT Service Providers and Seekers</h2>
                    <p className="text-base leading-relaxed">
                        For IT service providers, GeekOnDemand offers a unique platform to showcase their skills and expertise on a global stage. Our geeks are equipped to deliver exceptional results across a wide range of IT services, including Laptops/Desktops, Servers, Printers, Scanners, Routers, and more. This exposure not only boosts their professional growth but also allows them to work on diverse and challenging projects from the comfort of their homes.
                    </p>
                    <p className="text-base leading-relaxed mt-4">
                        For seekers, GeekOnDemand provides access to India&apos;s unparalleled IT talent. Whether you are looking for specialized IT solutions or comprehensive IT infrastructure support, our platform connects you with the right experts. This ensures that your technological needs are met with precision and excellence, driving innovation and efficiency within your organization.
                    </p>
                    </section>

                    <section className="mb-2">
                    <h2 className="text-2xl font-semibold mb-2">Nationwide Impact</h2>
                    <p className="text-base leading-relaxed">
                        GeekOnDemand is more than just a marketplace; it is a catalyst for change. By connecting talented Indian professionals with clients worldwide, we are driving economic growth and creating new job opportunities. Our mission is to boost the Indian economy by providing local IT professionals with global opportunities, thereby creating more job opportunities for Indian youth and enhancing the global IT landscape.
                    </p>
                    </section>

                    <section className="mb-2">
                    <h2 className="text-2xl font-semibold mb-2">Empowering Our Geeks</h2>
                    <p className="text-base leading-relaxed">
                        From the perspective of our geeks, GeekOnDemand is a platform that empowers them to achieve their professional aspirations. It provides them with the resources and opportunities needed to succeed in the global market. By fostering a culture of innovation and collaboration, we encourage our geeks to push boundaries and explore new technologies. This empowerment and support help them to deliver the highest quality services and achieve unparalleled value in their work.
                    </p>
                    </section>

                    <section className="mb-2">
                    <h2 className="text-2xl font-semibold mb-2">Join the Tech Collaboration World</h2>
                    <p className="text-base leading-relaxed">
                        At GeekOnDemand, we believe in the power of collaboration and the boundless potential of Indian talent. Join us in our mission to transform the IT industry, create a thriving ecosystem where talent and opportunity converge, and make a significant impact on the global economy.
                    </p>
                    </section>

                    <div className="mt-10 text-center">
                    <p className="font-semibold">Warm regards,</p>
                    <p className="mt-1">Rajesh Gade</p>
                    <p className="text-sm text-gray-600">Founder and CEO, GeekOnDemand</p>
                    </div>
                   </div>
                </div>
            </div>
        </div>
        </section>
  )
}

export default FounderMessage
