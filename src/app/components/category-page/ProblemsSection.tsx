import { CategoryPageProblem } from "@/utils/categoryPage";

interface Props {
  problems: CategoryPageProblem[];
  categoryTitle?: string;
}

const ProblemsSection = ({ problems, categoryTitle }: Props) => {
  if (!problems?.length) return null;

  return (
    <section className="py-8 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="flex items-center gap-16">
            <div className="w-12 h-0.5 bg-yellow-500 rounded-full" />
          <span className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-teal-800">
            Popular IT Support Services
          </span>
            <div className="w-12 h-0.5 bg-teal-500 rounded-full" />

          </div>
          {/* <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
            Problems We Fix
          </h2> */}
          {/* {categoryTitle && (
            <p className="text-center text-gray-500 text-sm max-w-xl">
              Common {categoryTitle.toLowerCase()} issues our verified Geeks resolve at your doorstep.
            </p>
          )} */}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-5">
          {problems.map((problem) => (
            <div
              key={problem._id}
              className=" shadow rounded-xl px-2 py-3 flex flex-col items-center gap-3 text-center hover:border-teal-500 hover:shadow-sm transition-all"
            >
              {problem.icon?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={problem.icon.url} alt="" className="w-20 h-20 object-contain" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-teal-50" />
              )}
              <span className="text-xs font-bold text-gray-800 leading-snug">{problem.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
