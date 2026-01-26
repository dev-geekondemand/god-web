import Link from 'next/link'
import React from 'react'

const TOS = () => {
  return (
    <section className='w-full flex flex-col justify-center items-center'>
        <div className='w-full relative breadcrumb-bg-2'>
            <div className='w-full breadcrumb-bg  relative flex justify-center items-center py-10  text-center bg-[#fbfbfb]'>
                <div className='xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto'>
                    <div className='flex flex-wrap w-full'>
                        <div className='w-full flex flex-col gap-3 items-center justify-center'>
                            <h2 className='text-4xl font-bold text-black'>Terms of Service</h2>
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
                            <p className=' text-gray-600'>Terms of Service</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        
        </div>
    <div className="max-w-6xl mx-auto px-4 py-20">

    <div className=" px-4">
      <div className="space-y-6 text-base leading-relaxed text-gray-800">
        <p>
          This website <a href="https://www.geekondemand.in" className="text-blue-600 underline">https://www.geekondemand.in</a> (&quot;Website&quot;) is owned and operated by GeekOnDemand Private Limited (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;). The Company is registered under the Companies Act, 2013 and is dedicated to digitizing the IT service marketplace with its corporate office at Level 1, Suite #1, Tourism Plaza, Begumpet, Greenlands, Hyderabad, Telangana – 500016.
        </p>

        <p>
          These Terms of Services (&quot;Agreement&quot;) govern your use of the Website and its associated services. By accessing or using the Website, you acknowledge that you have read, understood, and agree to be bound by this Agreement and our Privacy Policy.
        </p>

        <p>
          This is a legally binding Agreement as per the Information Technology Act, 2000. The Company may revise this Agreement at any time. Continued use of the Website indicates acceptance of any modifications.
        </p>

        <h2 className="text-2xl font-semibold">Definitions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Service:</strong> Platform use for engaging services rendered by Geeks to Seekers including IT services via chat, video, phone, or in person.</li>
          <li><strong>Geek(s):</strong> IT professionals using the platform to market services. They are not employees or agents of the Company.</li>
          <li><strong>Geek Profile(s):</strong> Information listed by Geeks regarding their qualifications and expertise.</li>
          <li><strong>Seeker(s):</strong> Clients using the Website to hire Geeks.</li>
          <li><strong>User(s):</strong> Includes all visitors to the Website (both Seekers and Geeks).</li>
          <li><strong>User Account:</strong> Online account necessary to access the Website, created with required information.</li>
        </ul>

        <h2 className="text-2xl font-semibold">Terms of Use</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Be at least 18 years of age and legally capable of forming binding contracts.</li>
          <li>Use the platform for personal use only (for Seekers).</li>
          <li>Not copy, replicate, or reverse engineer any part of the Website.</li>
          <li>Follow the applicable pricing plan for Geeks (free or paid).</li>
        </ul>

        <h2 className="text-2xl font-semibold">User Accounts</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Only one account per User is allowed.</li>
          <li>Verification required via mobile/email; Geeks must verify identity via Govt. ID.</li>
          <li>The Company is not responsible for any unverified content posted by Geeks.</li>
        </ul>

        <h2 className="text-2xl font-semibold">User Obligations</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You are responsible for accuracy of your information.</li>
          <li>Must comply with Indian laws.</li>
          <li>You indemnify the Company against any legal claims arising from your activity.</li>
          <li>Seekers and Geeks are responsible for direct dealings, including payments and task specifics.</li>
        </ul>

        <h2 className="text-2xl font-semibold">Prohibited Behaviour</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>No fraudulent, abusive, illegal, or harmful activities.</li>
          <li>No duplicate accounts or bots.</li>
          <li>No malicious code, denial-of-service attempts, or data scraping.</li>
          <li>No copyright infringement or impersonation.</li>
        </ul>

        <h2 className="text-2xl font-semibold">Posting and Bidding</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Geeks may post and promote their services via profiles.</li>
          <li>Seekers may post jobs/tasks via their accounts.</li>
          <li>The Company does not endorse or recommend any listed Geek.</li>
        </ul>

        <h2 className="text-2xl font-semibold">Payment and Credit Usage</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Free access for Seekers.</li>
          <li>Free and paid plans may apply for Geeks in the future based on visibility and services.</li>
        </ul>

        <h2 className="text-2xl font-semibold">Intellectual Property</h2>
        <p>
          All content, trademarks, and design elements on the Website are the property of the Company. You are prohibited from copying, reverse engineering, or misusing any intellectual property.
        </p>
        <p>
          Reviews, ratings, and comments posted by you may be used by the Company for promotional or functional purposes.
        </p>

        <h2 className="text-2xl font-semibold">Availability</h2>
        <p>
          The Company strives to keep the Website available, but offers no guarantees regarding uptime, service quality, or uninterrupted access.
        </p>

        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <p>
          The Company shall not be liable for direct or indirect damages including errors, personal injury, data loss, or service disruptions caused by users, third parties, or technical issues.
        </p>

        <h2 className="text-2xl font-semibold">Termination and Suspension</h2>
        <p>
          Misleading content or violations of this Agreement can result in account suspension or termination without notice. Legal action may be taken for violations.
        </p>

        <h2 className="text-2xl font-semibold">Third-Party Services</h2>
        <p>
          Use of external services like payment gateways or Google Maps is subject to those providers’ terms. The Company is not liable for issues arising from third-party services.
        </p>

        <h2 className="text-2xl font-semibold">Governing Law & Dispute Resolution</h2>
        <p>
          All disputes are governed by Indian law and subject to the exclusive jurisdiction of Hyderabad, Telangana. Arbitration, if necessary, will be conducted in Hyderabad in accordance with the Arbitration and Conciliation Act, 1996.
        </p>

        <h2 className="text-2xl font-semibold">Privacy and Data Handling</h2>
        <p>
          User data is handled according to the Company’s Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold">Severability</h2>
        <p>
          If any part of this Agreement is deemed invalid under law, the rest remains in full force and effect.
        </p>

        <p className='text-lg font-semibold'>
          For questions or feedback, contact us at{" "}
          <a href="mailto:hello@geekondemand.in" className="text-blue-600 underline">
            hello@geekondemand.in
          </a>{" "}
          or visit our Contact Page.
        </p>
      </div>
    </div>
  </div>
    </section>
  )
}

export default TOS
