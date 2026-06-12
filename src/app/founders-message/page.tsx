import Image from 'next/image'
import PageBanner from '@/app/components/PageBanner'

const FounderMessage = () => {
  return (
    <section className='w-full flex flex-col justify-center items-center bg-gray-50'>
      <PageBanner title="Founder's Message" crumbs={[{ label: "Founder's Message" }]} />

      <div className='w-full flex flex-col py-10'>
        <div className="max-w-5xl mx-auto sm:px-4 px-2 w-full text-gray-800">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* Logo banner */}
            <div className='w-full h-[30vh] founder-bg border-b relative'>
              <div className='relative w-full h-full'>
                <Image
                  src="/assets/logo-big.webp"
                  fill
                  sizes="100vw"
                  alt="GeekOnDemand Logo"
                  style={{ objectFit: 'contain', objectPosition: 'center', padding: '20px' }}
                  className='strech w-full'
                />
              </div>
              <div className='w-36 h-36 rounded-full border-4 border-white absolute -bottom-14 left-8 bg-gray-100 shadow-md overflow-hidden'>
                <Image
                  src="/assets/founder.jpg"
                  width={112}
                  height={112}
                  alt="Rajesh Gade"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Founder info */}
            <div className='w-full lg:px-10 px-5 pt-18 pb-2 mt-2'>
              <h2 className="text-2xl font-bold text-gray-900 mb-0.5">Rajesh Gade</h2>
              <p className="text-teal-600 font-medium text-sm mb-0">Founder &amp; CEO, GeekOnDemand</p>
            </div>

            <div className='lg:px-10 px-5 pt-4 pb-2'>
              <hr className="border-gray-100" />
            </div>

            {/* Letter body */}
            <div className='w-full flex flex-col lg:px-10 px-5 pb-10 gap-5'>

              <div className='border-l-4 border-teal-500 pl-4 py-0.5'>
                <p className="text-lg font-semibold text-gray-800 mb-0">Dear Visitors,</p>
              </div>

              <p className="text-base leading-relaxed text-gray-700">
                Technology has become an inseparable part of our lives and businesses. Yet, when technology fails, finding
                the right, trustworthy, and timely IT support often remains a challenge. This simple observation became the
                inspiration behind <strong>GeekOnDemand</strong>.
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                With over <strong>38+ years of experience</strong> across the Information Technology, Communications, and
                Life Sciences industries, I have had the opportunity to build businesses, lead strategic initiatives, manage
                startups, drive business growth, and advise on mergers &amp; acquisitions. Throughout my journey, one principle
                has remained constant —&nbsp;<em>technology should empower people, not create barriers.</em>
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                This belief led to the creation of <strong>GeekOnDemand – India&apos;s 1st IT Tech Support Marketplace</strong>,
                a unique platform designed to connect Individuals, Homes, SOHO, SMBs, and Enterprises with verified and skilled
                IT professionals (&quot;Geeks&quot;) for on-demand technology support.
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                Our vision is to build India&apos;s largest ecosystem for IT support, where technology seekers can easily
                discover the right expertise for services ranging from laptops, desktops, printers, networks, servers, storage,
                cloud, and cybersecurity solutions.
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                For our Geeks, GeekOnDemand represents more than just a marketplace — it is a platform for{' '}
                <strong>visibility, growth, entrepreneurship, and professional success</strong>. We aim to empower thousands
                of talented IT professionals and service partners across India by providing them opportunities to showcase
                their skills and connect with customers who truly need their expertise.
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                At GeekOnDemand, we are not merely solving a support problem; we are creating a technology ecosystem that
                generates employment, promotes digital inclusion, strengthens local IT talent, and contributes to India&apos;s
                growing digital economy.
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                As we continue this journey, our commitment remains clear — to make reliable IT support accessible to
                everyone, anywhere, anytime.
              </p>

              <p className="text-base leading-relaxed text-gray-700">
                I invite you to join us in shaping the future of technology support and becoming part of this exciting movement.
              </p>

              <div className='bg-teal-50 border border-teal-100 rounded-lg px-6 py-4 my-1 text-center'>
                <p className="text-xl font-bold text-teal-700 mb-0 tracking-wide">Just Geek IT!</p>
              </div>

              <div className='flex flex-col gap-0.5 mt-2'>
                <p className="text-lg font-bold text-gray-900 mb-0">Rajesh Gade</p>
                <p className="text-sm text-gray-500 mb-0">Founder &amp; CEO</p>
                <p className="text-sm text-teal-600 font-medium mb-0">GeekOnDemand</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FounderMessage
