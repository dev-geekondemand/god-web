import PageBanner from '@/app/components/PageBanner';

const RefundCancellationPolicy = () => {
  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <PageBanner title="Refund & Cancellation Policy" crumbs={[{ label: 'Refund & Cancellation Policy' }]} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <section className="space-y-8">
          <p className="text-gray-600">
            Welcome to GeekOnDemand! GeekOnDemand (“Company”/ “we”/ “our”/ “us”) Website is an online platform that operates towards digitizing the IT service marketplace. This Refund and Cancellation Policy outlines our terms and conditions pertaining to refund and cancellation of payments made to the Company. Please read this policy carefully, together with our Terms of Service Agreement.
          </p>

          <p className="text-gray-600">
            As specified in the Terms of Service Agreement under Clause VI, Geeks can register and post their services for free or choose a subscription model based on their needs by paying the requisite “Subscription Fees.” Geeks can also avail a feature to boost their profiles on the homepage of the Website and/or under specific service categories for the payment of additional “Boost Profile Fees.”
          </p>

          <p className="text-gray-600">
            This Refund and Cancellation Policy is applicable to Geeks in respect of the Subscription Fees and Boost Profile Fees that may be paid to the Company. The Company does not charge fees of any nature to Seekers for accessing the Website and identifying Geeks.
          </p>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">1. No Refund or Cancellation Permitted</h2>
            <p className="text-gray-600">
              We do not provide cancellation or offer refunds for any Subscription Fee or Boost Profile Fee paid through the Website. Subject to Clause 2 of this Refund and Cancellation Policy, once a Subscription Fee or Boost Profile Fee is paid, no request for refund or cancellation under any circumstance shall be entertained.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">2. Exceptions</h2>
            <p className="text-gray-600">
              Clause 1 shall be strictly upheld and applied universally to all payments except those at the sole discretion of the Company. The discretion of the Company to allow any request for refund or cancellation shall be exercised on a case-to-case basis and cannot be demanded by any Geek or any other Stakeholder.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">3. Violation of Terms of Service and/or Policy</h2>
            <p className="text-gray-600">
              Violation of the Terms of Service Agreement and/or Privacy Policy will result in the immediate suspension or termination of the concerned Geek&apos;s account without any refund of Subscription Fee and/or Boost Profile Fee that may have been paid. The Company also reserves the right to initiate any legal action in relation to such violation.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">4. Agreement to Terms</h2>
            <p className="text-gray-600">
              By utilizing the Website and purchasing Subscription(s) and/or Boost Profile Feature(s), the Geeks hereby agree to the Terms and Conditions contained herein.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">5. Payment Responsibility</h2>
            <p className="text-gray-600">
              Seeker(s) and Geek(s) are responsible for independently negotiating payment terms before the commencement of work, and the Company shall not bear any responsibility with respect to payment transactions therein.
            </p>
            <p className="text-gray-600">
              Any issue(s) pertaining to payment transactions shall be resolved between the concerned Geek and Seeker independently. The Company reserves the right to intervene on the receipt of any payment-related complaint but does not guarantee the recovery of any payment.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">6. Conflict Resolution</h2>
            <p className="text-gray-600">
              Any issue pertaining to the payment gateway of the Website shall be dealt with in accordance with the terms and policies of Razorpay.
            </p>
            <p className="text-gray-600">
              Any issue arising out of a payment gateway transaction, including but not limited to fraudulent card usage, impersonation, or numerical errors, shall be resolved between the concerned Geek and the Payment Gateway in accordance with the policies of Razorpay. The Company shall offer assistance on a best-effort basis.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className="text-2xl font-semibold text-gray-700">7. Contact Information</h2>
            <p className="text-gray-600 text-lg font-semibold">
              For any inquiries or concerns, kindly contact us at{' '}
              <a href="mailto:hello@geekondemand.in" className="text-blue-600 underline">
                hello@geekondemand.in
              </a>. Visit our Contact Page for more information.
            </p>
            <p className="text-sm font-semibold text-gray-500">Policies Updated: Oct 5th, 2024</p>
          </section>
        </section>
      </div>
    </section>
  );
};

export default RefundCancellationPolicy;
