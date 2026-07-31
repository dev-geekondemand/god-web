import { Calendar, User, Search, Wrench, CreditCard, CalendarDays } from "lucide-react";

const steps = [
  {
    icon: CalendarDays,
    title: "Book Your Service",
    description: "Choose your service and preferred time.",
  },
  {
    icon: User,
    title: "Get Matched",
    description: "We connect you with a verified Geek.",
  },
  {
    icon: Search,
    title: "Diagnosis & Estimate",
    description: "We check the issue and share a transparent estimate.",
  },
  {
    icon: Wrench,
    title: "Repair & Testing",
    description: "We fix it and test it thoroughly.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    description: "Pay only once you're satisfied.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-14 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-12">
          <div className="flex items-center gap-8">
            <div className="w-10 h-0.5 bg-yellow-500 rounded-full" />
          <span className="text-sm font-bold uppercase tracking-wide text-teal-800">
            How it works
          </span>
            <div className="w-10 h-0.5 bg-yellow-500 rounded-full" />

          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            Simple steps. Smart solution.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-0 overflow-scroll custom-scrollbar">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isTeal = i % 2 === 0;
            return (
              <div key={step.title} className="flex md:flex-1 md:flex-col items-center gap-4 md:gap-3 md:text-center">
                <div className="flex md:flex-col items-center gap-4 md:gap-3 w-full">
                  <div className="flex items-start justify-center  md:gap-3 w-full">
                    <div className="flex flex-col gap-3 items-center w-full md:w-auto">
                    <div
                      className={`relative shrink-0 border-8 border-gray-200  w-20 h-20 rounded-full flex items-center justify-center text-white ${
                        isTeal ? "bg-teal-700" : "bg-amber-400"
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 text-[11px] font-bold flex items-center justify-center text-gray-700">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      
                    </div>
                    <div className="md:max-w-[9rem]">
                    <h3 className="font-bold text-gray-800 text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                   
                  </div>
                  <div className="hidden md:flex flex-1 mx-4 h-16 items-center justify-center">
                     {i < steps.length - 1 && (
                      <svg
                        className="hidden md:block flex-1 h-3 mx- text-gray-400"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        <line
                          x1="0"
                          y1="10"
                          x2="92"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d="M86 2 L98 10 L86 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    )}
                  </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
