import Link from "next/link";
import { ShieldCheck, Clock, Truck, Star, CalendarDays, UsersRound } from "lucide-react";
import { CategoryPageData } from "@/utils/categoryPage";

interface Props {
  hero: CategoryPageData["hero"];
  categorySlug?: string;
}

const trustBadges = [
  { icon: ShieldCheck, label: "Verified Professionals" },
  { icon: Clock, label: "Same-Day Service" },
  { icon: Truck, label: "Doorstep Support" },
  { icon: ShieldCheck, label: "Genuine Parts" },
];

const CategoryPageHero = ({ hero, categorySlug }: Props) => {
  return (
    <section className="bg-white text-black py-2 md:py-6 px-4 sm:px-6 mb-6 sm:mb-3">
      <div className="max-w-7xl mx-auto grid md:grid-cols-7 gap-10 md:gap-14 items-start">
        <div className="flex flex-col col-span-3 gap-3 text-start md:text-left">
          {hero.badge && (
            <span className="self-start md:self-start bg-amber-400 text-teal-900 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full w-fit">
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
          <div className="flex flex-wrap gap-3 justify-start md:justify-start mt-1">
            <Link
              href={categorySlug ? `/categories/${categorySlug}/brands` : "/categories"}
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
                <span className="text-xl text-yellow-500 font-bold">430+</span>
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
          <div className="relative w-full flex justify-center items-center">
            {hero.image?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.image.url}
              alt={hero.alt || hero.title}
              className="w-full  aspect-[2/1] rounded-xl object-cover"
            />
          )}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[92%] sm:w-[85%] max-w-sm gap-1.5 sm:gap-2 bg-teal-800/95 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 shadow-lg">
              <p className=" w-full text-center flex justify-center items-center text-white text-base sm:text-lg font-bold">Just Geek IT!</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoryPageHero;
