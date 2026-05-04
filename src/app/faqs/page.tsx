"use client";
import { useState } from "react";
import PageBanner from "@/app/components/PageBanner";

/* ---------------- Types ---------------- */
interface AccordionItemProps {
  question: string;
  answer: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
}

/* ---------------- Components ---------------- */
const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer flex justify-between items-center p-4 text-left font-medium text-gray-800 hover:bg-gray-50"
      >
        <span>{question}</span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQSection: React.FC<FAQSectionProps> = ({ title, faqs }) => (
  <div className="mb-12 w-full md:w-1/2 px-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
    {faqs.map((faq, index) => (
      <AccordionItem
        key={index}
        question={faq.question}
        answer={faq.answer}
      />
    ))}
  </div>
);

/* ---------------- Page ---------------- */
const FAQs: React.FC = () => {
  const seekerFAQs: FAQ[] = [
    {
      question: "What is GeekOnDemand and how does it work?",
      answer:
        "GeekOnDemand is India’s first zero-commission IT tech support marketplace where you can hire verified technicians for onsite and remote tech support. Simply describe your issue, and we connect you with the right Geek instantly.",
    },
    {
      question: "What types of IT services can I book on GeekOnDemand?",
      answer:
        "You can book post-warranty hardware repair, software troubleshooting, network setup, Wi-Fi issues, laptop/desktop repair, server configuration, data recovery, email/Office issues, and more. We support home users, startups, SMBs, and communities.",
    },
    {
      question: "Are the technicians verified and skilled?",
      answer:
        "Yes. Every Geek is background-verified, skill-tested, and continuously rated to ensure safe, reliable, and high-quality service.",
    },
    {
      question: "How much does IT support cost?",
      answer:
        "Pricing is transparent and fixed based on the service selected. There are no hidden charges.",
    },
    {
      question: "How fast can a Geek reach my home or office?",
      answer:
        "Most requests are assigned instantly. Arrival time depends on your location and selected time slot.",
    },
    {
      question: "Do you provide remote tech support?",
      answer:
        "Yes. Many issues such as software installation, email setup, antivirus configuration, and troubleshooting can be resolved remotely.",
    },
    {
      question: "Is my data safe during service?",
      answer:
        "Absolutely. Geeks follow strict data privacy and security protocols. No data is accessed without your permission.",
    },
    {
      question: "Do you offer IT support for offices and communities?",
      answer:
        "Yes. We offer office network setup, device maintenance, bulk troubleshooting, dedicated IT specialists, and AMC-style services.",
    },
    {
      question: "Can I track the technician in real time?",
      answer:
        "Yes. You can track your Geek and receive live service updates through our web or app interface.",
    },
    {
      question: "What if my issue remains unresolved?",
      answer:
        "You can request a free follow-up, escalate the issue, or request a different Geek.",
    },
  ];

  const geekFAQs: FAQ[] = [
    {
      question: "How do I become a Geek on GeekOnDemand?",
      answer:
        "Apply online by submitting your details and experience. After verification, you can start receiving IT service jobs.",
    },
    {
      question: "How much can I earn?",
      answer:
        "Geeks keep 100% of their earnings. Income depends on the number of jobs you accept.",
    },
    {
      question: "What skills are required?",
      answer:
        "Laptop/desktop repair, OS/software installation, network setup, Wi-Fi configuration, and data backup skills are required.",
    },
    {
      question: "How will I get service jobs?",
      answer:
        "Jobs are assigned based on location, skills, availability, and ratings. You can accept or decline requests.",
    },
    {
      question: "Do I need to pay commission?",
      answer: "No. GeekOnDemand takes zero commission.",
    },
    {
      question: "Do I need my own tools?",
      answer:
        "Yes. Technicians should carry basic tools required for service visits.",
    },
    {
      question: "Are training and upskilling provided?",
      answer:
        "Yes. We partner with OEMs and training providers for continuous upskilling.",
    },
    {
      question: "How do customers pay me?",
      answer:
        "Payments are made directly from the customer to you. GeekOnDemand does not process payments.",
    },
    {
      question: "Can I work part-time or full-time?",
      answer:
        "Yes. You can choose flexible hours and service areas.",
    },
    {
      question: "What support does GeekOnDemand offer?",
      answer:
        "We provide job assignments, customer inflow, branding visibility, AI-powered tools (Geek Genie), and escalation support.",
    },
  ];

  return (
    <section className='w-full relative bg-gray-50 '>
    <PageBanner title="Frequently Asked Questions" crumbs={[{ label: 'FAQs' }]} />
        <div className="max-w-6xl w-full gap-12 flex md:flex-row flex-col justify-center items-center md:items-start mx-auto px-4 py-6">

      <FAQSection title="FAQs for Seekers (Customers)" faqs={seekerFAQs} />
      <FAQSection title="FAQs for Geeks (Service Providers)" faqs={geekFAQs} />
    </div>
    </section>
    
  );
};

export default FAQs;
