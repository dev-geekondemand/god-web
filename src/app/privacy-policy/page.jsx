import PageBanner from '@/app/components/PageBanner'

const PrivacyPolicy = () => {
  return (
        <section className='w-full flex flex-col justify-center items-center'>
        <PageBanner title="Privacy Policy" crumbs={[{ label: 'Privacy Policy' }]} />

    <div className="max-w-6xl mx-auto px-4 py-10">

    <section className="space-y-8">
    <p className=" text-gray-600">
        This website{' '}
        <a href="https://www.geekondemand.in/" className="text-blue-600 underline">
        geekondemand.in
        </a>{' '}
        (Hereinafter referred to as the “Website”) is owned and operated by GeekOnDemand Private Limited (Hereinafter referred to as the “Company”/ “we”/ “our”), a Company registered under the Companies Act, 2013 dedicated to digitizing the IT service marketplace, having its corporate office at Level 1, Suite #11, Tourism Plaza, Begumpet, Greenlands, Hyderabad, Telangana – 500016.
    </p>

    <p className=" text-gray-600">
        The Privacy Policy (Hereinafter referred to as the “Policy”) contained herein shall govern your use of the Website, including all the pages linked to this website.
    </p>

    <div className=" rounded-md">
        <h2 className="text-2xl font-semibold text-gray-700">Policy Overview</h2>
        <p className=" text-gray-600">
        This Policy explains how we collect, use, store, share, and protect your personal data when you use the Website. By accessing or using the Website, you agree to the collection and use of information in accordance with this Policy.
        </p>
    </div>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">I. Data Collection</h2>
        <p className="text-gray-600">
        We collect personal information to enhance your experience with our Website and services. The types of personal information we collect include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
        <li className="text-gray-600">From Seekers: Name, email, phone number, location information, reviews, and communications.</li>
        <li className="text-gray-600">From Geeks: Name, email, phone number, location information, KYC details, qualifications, and bank information.</li>
        <li className="text-gray-600">Automatic Information: IP address, browsing history, cookies, and device identifiers.</li>
        </ul>
    </section>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">II. Use of Information</h2>
        <p className="text-gray-600">
        We use the collected data for the following purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
        <li className="text-gray-600">To verify user identities and prevent fraud.</li>
        <li className="text-gray-600">To improve user experience and provide personalized content.</li>
        <li className="text-gray-600">To promote Geek profiles and services.</li>
        <li className="text-gray-600">For legal and compliance purposes.</li>
        </ul>
    </section>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">III. Data Sharing</h2>
        <p className="text-gray-600">
        We may share your personal information with third parties for the following reasons:
        </p>
        <ul className="list-disc pl-6 space-y-2">
        <li className="text-gray-600">To comply with legal requirements or protect the rights and safety of the Company and its users.</li>
        <li className="text-gray-600">To facilitate communication between Seekers and Geeks.</li>
        <li className="text-gray-600">With third-party services like payment gateways to process transactions.</li>
        </ul>
    </section>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">IV. Data Retention</h2>
        <p className="text-gray-600">
        We retain your personal data for as long as it is necessary for the purpose of fulfilling our services or as required by law.
        </p>
    </section>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">V. Security</h2>
        <p className="text-gray-600">
        We implement various security measures to protect your personal information, including encryption and secure storage. You are also responsible for keeping your account information secure.
        </p>
    </section>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">VI. Children's Privacy</h2>
        <p className="text-gray-600">
        The Website is not intended for use by children under the age of 18, and we do not knowingly collect personal information from children.
        </p>
    </section>

    <section className='space-y-3'>
        <h2 className="text-2xl font-semibold text-gray-700">VII. Contact Information</h2>
        <p className="text-gray-600">
        If you have any questions or concerns regarding this Privacy Policy, please contact us at{' '}
        <a href="mailto:hello@geekondemand.in" className="text-blue-600 underline">
            hello@geekondemand.in
        </a>.
        </p>
    </section>
    </section>
    </div>
    </section>
  )
}

export default PrivacyPolicy
