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

const PAGE_SIZE = 6;

const getPageNumbers = (current: number, total: number): (number | "…")[] => {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
};

const statusConfig: Record<string, { badge: string; dot: string }> = {
  Pending:   { badge: "bg-amber-50 text-amber-700 border border-amber-200",  dot: "bg-amber-400" },
  Matched:   { badge: "bg-teal-50 text-teal-700 border border-teal-200",    dot: "bg-teal-400" },
  Accepted:  { badge: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500" },
  Completed: { badge: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500" },
  Rejected:  { badge: "bg-red-50 text-red-700 border border-red-200",       dot: "bg-red-400" },
  Cancelled: { badge: "bg-red-50 text-red-700 border border-red-200",       dot: "bg-red-400" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = statusConfig[status] || { badge: "bg-gray-100 text-gray-500 border border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const cardAccentColor: Record<string, string> = {
  Pending:   "border-l-amber-400",
  Matched:   "border-l-teal-400",
  Accepted:  "border-l-green-500",
  Completed: "border-l-green-500",
  Rejected:  "border-l-red-400",
  Cancelled: "border-l-red-400",
};

const TABS = ["All", "Pending", "Matched", "Accepted", "Completed", "Rejected"];

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

  const getCounts = () => {
    const counts: Record<string, number> = { All: existingRequests.length };
    TABS.slice(1).forEach((tab) => {
      counts[tab] = existingRequests.filter((r) => (r.geekResponseStatus || r.status) === tab).length;
    });
    return counts;
  };
  const counts = getCounts();

  const filtered =
    filter === "All"
      ? existingRequests
      : existingRequests.filter((r) => (r.geekResponseStatus || r.status) === filter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changeFilter = (tab: string) => {
    setFilter(tab);
    setPage(1);
  };

  const canView = (req: ServiceRequest) =>
    req?.geekResponseStatus === "Accepted" ||
    req?.geekResponseStatus === "Completed" ||
    req?.geekResponseStatus === "Pending" ||
    req?.status === "Completed";

  return (
    <section className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
      <PageBanner
        title="My Services"
        crumbs={[
          { label: "Profile", href: `/seeker/${id}` },
          { label: "My Services" },
        ]}
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 pb-16">
        {/* Stats row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {TABS.map((tab) => {
            const dot = tab === "All" ? "bg-gray-400" : (statusConfig[tab]?.dot || "bg-gray-400");
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => changeFilter(tab)}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-center transition-all ${
                  isActive
                    ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-teal-300"
                }`}
              >
                <span className={`text-xl font-bold ${isActive ? "text-white" : "text-gray-900"}`}>
                  {counts[tab] ?? 0}
                </span>
                <div className="flex items-center gap-1">
                  {tab !== "All" && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white/70" : dot}`} />}
                  <span className={`text-xs font-medium ${isActive ? "text-white/90" : "text-gray-500"}`}>{tab}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {paginated.map((req) => {
            const geek = req.geek instanceof Object ? req.geek : null;
            const geekName = geek ? `${geek.fullName?.first ?? ""} ${geek.fullName?.last ?? ""}`.trim() : "";
            const geekAvatar = geek?.profileImage?.url || "/assets/images/placeholder_user.jpg";
            const displayStatus = req.geekResponseStatus || req.status;
            const accent = cardAccentColor[displayStatus] || "border-l-gray-300";

            return (
              <div
                key={req._id}
                className={`bg-white rounded-xl border border-gray-100 border-l-4 ${accent} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                  {/* Category image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 relative">
                      <Image
                        fill
                        className="object-cover"
                        src={req.category?.image?.url || "/assets/images/blogImg.jpg"}
                        alt="Service"
                        sizes="80px"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{req?.category?.title}</h3>
                      <StatusBadge status={displayStatus} />
                    </div>

                    {geek && (
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                          <Image src={geekAvatar} width={28} height={28} className="w-full h-full object-cover" alt={geekName} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{geekName}</p>
                          {geek.primarySkill?.title && (
                            <p className="text-xs text-gray-400 truncate">{geek.primarySkill.title}</p>
                          )}
                        </div>
                        {(displayStatus === "Accepted" || displayStatus === "Completed") && geek.mobile && (
                          <div className="ml-auto flex items-center gap-1 text-xs text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-lg flex-shrink-0">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.22 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.17a16 16 0 006.92 6.92l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            {geek.mobile}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
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
                  {canView(req) && (
                    <div className="flex-shrink-0 sm:ml-2 self-center sm:self-start mt-1">
                      <button
                        onClick={() => router.push(`/seeker/${id}/services/${req._id}`)}
                        className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-teal-100"
                      >
                        View Details
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold">No {filter !== "All" ? filter.toLowerCase() : ""} services found.</p>
            <p className="text-gray-400 text-sm mt-1">Services will appear here once matched with a Geek.</p>
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
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                Prev
              </button>
              {getPageNumbers(safePage, totalPages).map((n, i) =>
                n === "…" ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400 text-xs select-none">…</span>
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
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Requests;
