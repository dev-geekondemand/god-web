import Image from 'next/image'
import PageBanner from '@/app/components/PageBanner'

const FounderMessage = () => {
  return (
    <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
        <PageBanner title="Founder's Message" crumbs={[{ label: "Founder's Message" }]} />

        <div className='w-full flex flex-col py-10 '>
            <div className="max-w-6xl mx-auto sm:px-4 px-1  text-gray-800">

                <div className="bg-white p-4  rounded-md shadow-sm">
                    <div className='w-full h-[30vh] flex items-center rounded-md founder-bg border p-4 relative'>
                        <Image src="/assets/logo-big.webp" className='w-full' width={300} height={200} alt="Founder" style={{ height: 'auto' }} />
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
