import { UserCheck, Clock, Truck, IndianRupee, ShieldCheck, ThumbsUp } from "lucide-react";

const points = [
  {
    icon: UserCheck,
    title: "Verified & Experienced Professionals",
    description: "Every Geek is background-checked and skilled — trust who touches your device.",
  },
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Quick response, faster resolution.",
  },
  {
    icon: Truck,
    title: "Doorstep + Remote Support",
    description: "We come to you, or connect remotely.",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    description: "No hidden charges, zero commission.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Spare Parts",
    description: "Quality parts for long-lasting performance.",
  },
  {
    icon: ThumbsUp,
    title: "100% Satisfaction Focus",
    description: "We stand by our work, every time.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="">
      <div className="max-w-7xl bg-teal-800 mx-auto  py-5 px-6 md:px-12 rounded-3xl">
        <div className="flex flex-col items-center gap-0 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            Why GeekOnDemand
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
            Built for trust, not just speed
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {points.map((point, index) => {
            const Icon = point.icon;
            const isTeal = index % 2 === 0;
            return (
              <div
                key={point.title}
                className="bg-gray-100 rounded-xl p-4 flex flex-col items-center text-center gap-2"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center ${
                    isTeal ? "bg-teal-800" : "bg-yellow-500"
                  }`}
                >
                  <Icon className={`w-7 h-7 text-white`} />
                </div>
                <h3 className="text-xs font-bold text-gray-900 leading-snug">{point.title}</h3>
                <p className="text-[11px] text-gray-700 leading-snug">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
