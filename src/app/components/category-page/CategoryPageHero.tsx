import Link from "next/link";
import { ShieldCheck, Clock, Truck, Star, CalendarDays, UsersRound } from "lucide-react";
import { CategoryPageData } from "@/utils/categoryPage";

interface Props {
  hero: CategoryPageData["hero"];
}

const trustBadges = [
  { icon: ShieldCheck, label: "Verified Professionals" },
  { icon: Clock, label: "Same-Day Service" },
  { icon: Truck, label: "Doorstep Support" },
  { icon: ShieldCheck, label: "Genuine Parts" },
];

const CategoryPageHero = ({ hero }: Props) => {
  return (
    <section className="bg-white text-black py-2 md:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-7 gap-10 md:gap-14 items-start">
        <div className="flex flex-col col-span-3 gap-3 text-start md:text-left">
          {hero.badge && (
            <span className="self-center md:self-start bg-amber-400 text-teal-900 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full w-fit">
              {hero.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight whitespace-pre-line">
            {hero.title.split("\n").map((line, i) => (
              <span key={i} className={i === 0 ? "block text-black" : "block text-teal-900"}>
                {line}
              </span>
            ))}
          </h1>
          {hero.subtitle && (
            <p className="text-sm sm:text-base text-gray-800 max-w-xl">{hero.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-1">
            <Link
              href="/categories"
              className="bg-teal-800 flex justify-center items-center gap-2 text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-teal-900 transition-colors"
            >
              <CalendarDays className="w-5 h-5" />
              {hero.ctaText || "Book a Geek"}
            </Link>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-6 mt-3">
            <div className="flex  gap-5 items-center border border-gray-100 shadow rounded-lg px-3 py-2">
              
              <div className="border-r-2 border-teal-600 rounded-full p-1 flex justify-center items-center">
                <UsersRound />
              </div>
              
              <div className="flex flex-col items-start gap-1">
                <span className="text-xl text-yellow-500 font-bold">380+</span>
                <span className="text-xs font-semibold text-gray-800">Verified Geeks</span>
              </div>
                
              
            </div>
            <div className="flex  gap-5 items-center border border-gray-100 shadow rounded-lg px-3 py-2">
              
              <div className="border bg-teal-800 p-1.5 border-teal-600 rounded-full flex justify-center items-center">
               <Star className="text-yellow-500" />
              </div>
              
              <div className="flex flex-col items-start gap-1">
                <span className="text-xl text-teal-700 font-bold">4.8/5</span>
                <span className="text-xs font-semibold text-gray-800">Customer Rating</span>
              </div>
                
              
            </div>
          </div>
        </div>

        <div className="w-full col-span-4 flex flex-col items-center gap-2">
          <div className="w-full flex justify-center items-center">
            {hero.image?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.image.url}
              alt={hero.alt || hero.title}
              className="w-full  aspect-[2/1] rounded-xl object-cover"
            />
          )}
          </div>
          <div className="w-full -mx-20 max-w-md grid grid-cols-2 sm:grid-cols-4 gap-2 bg-teal-800 rounded-xl px-3 py-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] leading-tight text-teal-50">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPageHero;
