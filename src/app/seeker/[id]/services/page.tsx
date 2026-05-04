"use client";

import { getSeekerRequests } from "@/features/request/requestSlice";
import { ServiceRequest } from "@/interfaces/ServiceRequest";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import Image from "next/image";
import PageBanner from "@/app/components/PageBanner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PAGE_SIZE = 5;

const getPageNumbers = (current: number, total: number): (number | "…")[] => {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border border-amber-200",
    Matched: "bg-teal-100 text-teal-700 border border-teal-200",
    Accepted: "bg-green-100 text-green-700 border border-green-200",
    Completed: "bg-green-100 text-green-700 border border-green-200",
    Rejected: "bg-red-100 text-red-700 border border-red-200",
    Cancelled: "bg-red-100 text-red-700 border border-red-200",
  };
  return styles[status] || "bg-gray-100 text-gray-500 border border-gray-200";
};

const cardAccent = (status: string) => {
  if (status === "Pending") return "border-l-amber-400";
  if (status === "Accepted" || status === "Matched") return "border-l-teal-400";
  if (status === "Completed") return "border-l-green-400";
  return "border-l-red-400";
};

const azureLoader = ({ src }: { src: string }) => src;

const Requests = () => {
  const id = useSelector((state: RootState) => state.seeker?.user?._id);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [filter, setFilter] = useState<string>("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getSeekerRequests());
  }, [dispatch]);

  const requests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[];

  const existingRequests = requests.filter((r) => r.geek?._id !== undefined);
  const tabs = ["All", "Pending", "Matched", "Accepted", "Rejected"];
  const filtered =
    filter === "All"
      ? existingRequests
      : existingRequests.filter((r) => r.geekResponseStatus === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changeFilter = (tab: string) => {
    setFilter(tab);
    setPage(1);
  };

  return (
    <section className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
      <PageBanner
        title="My Services"
        crumbs={[
          { label: 'Profile', href: `/seeker/${id}` },
          { label: 'My Services' },
        ]}
      />

      {/* Content */}
      <div className="max-w-5xl w-full mx-auto px-4 py-8 pb-16">
        <div className="w-full max-w-4xl mx-auto">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => changeFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  filter === tab
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                }`}
              >
                {tab}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-400">
              {filtered.length} request{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-4">
            {paginated.map((req) => {
              const geek = req.geek instanceof Object ? req.geek : null;
              const geekName = geek
                ? `${geek.fullName?.first ?? ""} ${geek.fullName?.last ?? ""}`.trim()
                : "";
              const geekAvatar = geek?.profileImage?.url || "/assets/images/placeholder_user.jpg";

              return (
                <div
                  key={req._id}
                  className={`bg-white rounded-xl border border-gray-100 border-l-4 ${cardAccent(req.geekResponseStatus || req.status)} shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className="p-5 flex flex-col sm:flex-row gap-4 items-start">
                    {/* Category image */}
                    <div className="flex-shrink-0">
                      <Image
                        loader={azureLoader}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                        src={req.category?.image?.url || "/assets/images/blogImg.jpg"}
                        alt="Service"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 w-full overflow-hidden">
                      {/* Title + badge */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-800">{req?.category?.title}</h3>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusBadge(req.geekResponseStatus || req.status)}`}>
                          {req.geekResponseStatus || req.status}
                        </span>
                      </div>

                      {/* Geek info — inline row */}
                      {geek && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200">
                            <Image
                              loader={azureLoader}
                              src={geekAvatar}
                              width={28}
                              height={28}
                              className="w-full h-full object-cover"
                              alt={geekName}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{geekName}</p>
                            {geek.primarySkill?.title && (
                              <p className="text-xs text-gray-400 truncate">{geek.primarySkill.title}</p>
                            )}
                          </div>
                          {/* Show phone only when Accepted */}
                          {req.geekResponseStatus === "Accepted" && geek.mobile && (
                            <span className="ml-2 text-xs text-gray-500 flex-shrink-0">
                              {geek.mobile}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {new Date(req.createdAt).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Action */}
                    {(req?.geekResponseStatus === "Accepted" ||
                      req?.geekResponseStatus === "Completed" ||
                      req?.geekResponseStatus === "Pending") && (
                      <div className="flex-shrink-0 sm:ml-2 self-start">
                        <button
                          onClick={() => router.push(`/seeker/${id}/services/${req._id}`)}
                          className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                        >
                          View
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-16 h-16 text-gray-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400 font-medium">
                No {filter !== "All" ? filter.toLowerCase() : ""} requests found.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={safePage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Prev
                </button>
                {getPageNumbers(safePage, totalPages).map((n, i) =>
                  n === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-xs select-none">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium border transition-colors ${
                        safePage === n
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={safePage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Requests;
