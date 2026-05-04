"use client";

import { ServiceRequest } from "@/interfaces/ServiceRequest";
import React, { useEffect } from "react";
import { HoverCardComponent } from "./HoverCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hooks";
import Geek from "@/interfaces/Geek";
import { loadGeek } from "@/features/geek/geekSlice";
import Issue from "./Issue";

interface RequestProps {
  requests: ServiceRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border border-amber-200",
    Matched: "bg-teal-100 text-teal-700 border border-teal-200",
    Accepted: "bg-green-100 text-green-700 border border-green-200",
    Completed: "bg-green-100 text-green-700 border border-green-200",
    Rejected: "bg-red-100 text-red-700 border border-red-200",
    Cancelled: "bg-red-100 text-red-700 border border-red-200",
    Expired: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return styles[status] || "bg-gray-100 text-gray-500 border border-gray-200";
};

const cardAccent = (status: string) => {
  if (status === "Pending") return "border-l-amber-400";
  if (status === "Accepted" || status === "Matched") return "border-l-teal-400";
  if (status === "Completed") return "border-l-green-400";
  return "border-l-red-400";
};

const PAGE_SIZE = 5;

const getPageNumbers = (current: number, total: number): (number | "…")[] => {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
};

const Request: React.FC<RequestProps> = ({ requests, onAccept, onReject }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openIssueId, setOpenIssueId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>("All");
  const [page, setPage] = React.useState(1);

  const azureLoader = ({ src }: { src: string }) => src;
  const curGeek = useSelector((state: RootState) => state.geek.geek) as Geek;

  useEffect(() => {
    if (!curGeek?._id) dispatch(loadGeek());
  }, [dispatch, curGeek?._id]);

  const hoursLeft = (date: Date) => {
    const timeDiff = new Date().getTime() - date.getTime();
    return 24 - Math.ceil(timeDiff / (1000 * 60 * 60));
  };

  const minutesLeft = (date: Date) => {
    const timeDiff = new Date().getTime() - date.getTime();
    return 60 - Math.ceil(timeDiff / (1000 * 60));
  };

  const handleClick = (req: ServiceRequest) => {
    if (req?._id && req?.geekResponseStatus === "Accepted") {
      router.push(`/geeks/${curGeek?._id}/requests/${req._id}`);
    } else {
      toast.error("Only Accepted requests can be viewed.");
    }
  };

  const isExpired = (req: ServiceRequest) =>
    hoursLeft(new Date(req.createdAt)) <= 0 && minutesLeft(new Date(req.createdAt)) <= 0;

  const displayStatus = (req: ServiceRequest) => {
    if (req.geekResponseStatus === "Accepted") return "Accepted";
    if (isExpired(req) && req.geekResponseStatus === "Pending") return "Expired";
    return req.geekResponseStatus || req.status;
  };

  const tabs = ["All", "Pending", "Accepted", "Rejected"];
  const filtered = filter === "All" ? requests : requests.filter((r) => r.geekResponseStatus === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changeFilter = (tab: string) => { setFilter(tab); setPage(1); };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
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

      {/* Issue modal overlay */}
      <div
        hidden={!openIssueId}
        onClick={() => setOpenIssueId(null)}
        className="fixed inset-0 bg-gray-900/50 z-40"
      />
      {openIssueId && (
        <div className="fixed top-24 bottom-12 left-0 right-0 z-50 max-w-3xl mx-auto overflow-y-auto bg-white shadow-xl rounded-xl p-6">
          <button
            onClick={() => setOpenIssueId(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <Issue userIssue={requests.find((r) => r._id === openIssueId)?.issue} />
        </div>
      )}

      <div className="space-y-4">
        {paginated.map((req) => {
          const status = displayStatus(req);
          const canRespond =
            req.geekResponseStatus === "Pending" &&
            (hoursLeft(new Date(req.createdAt)) >= 0 || minutesLeft(new Date(req.createdAt)) >= 0);

          return (
            <div
              key={req._id}
              className={`bg-white rounded-xl border border-gray-100 border-l-4 ${cardAccent(req.geekResponseStatus || req.status)} shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="p-5 flex flex-col sm:flex-row gap-4 items-start">
                {/* Image */}
                <div onClick={() => handleClick(req)} className="flex-shrink-0 cursor-pointer">
                  <Image
                    loader={azureLoader}
                    width={100}
                    height={100}
                    className="w-20 h-20 object-cover rounded-lg"
                    src={req.category?.image?.url || "/assets/images/blogImg.jpg"}
                    alt="Service"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 w-full overflow-hidden">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <button
                      onClick={() => handleClick(req)}
                      className="text-base font-semibold text-gray-800 hover:text-teal-600 transition-colors text-left"
                    >
                      {req?.category?.title}
                    </button>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusBadge(status)}`}>
                      {status}
                    </span>
                  </div>

                  <div className="mt-2 max-w-full overflow-hidden">
                    {req.geekResponseStatus === "Accepted" ? (
                      <HoverCardComponent
                        linkText={"From: " + req.seeker?.fullName?.first + " " + (req.seeker?.fullName?.last ?? "")}
                        avatarImg={req.seeker?.profileImage || "/assets/images/placeholder_user.jpg"}
                        title={"Name: " + req?.seeker?.fullName?.first + " " + (req?.seeker?.fullName?.last ?? "")}
                        line1={
                          req.seeker?.authProvider === "google" || req.seeker?.authProvider === "microsoft"
                            ? "Email: " + req?.seeker?.email
                            : "Phone: " + req?.seeker?.phone
                        }
                        line2={"Joined on: " + new Date(req?.seeker?.createdAt).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                        mutedLine={
                          req?.seeker?.address?.line1
                            ? "Address: " + (req?.seeker?.address?.line1 + ", " || "") + (req?.seeker?.address?.line2 + ", " || "") + (req?.seeker?.address?.line3 || "")
                            : ""
                        }
                      />
                    ) : (
                      <p className="text-xs text-teal-500">Accept request to see seeker details.</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    </span>
                    {req?.issue && (
                      <button
                        onClick={() => setOpenIssueId(req._id)}
                        className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 underline underline-offset-2"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        View Issue
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:ml-2">
                  {canRespond ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAccept(req._id)}
                        className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Accept
                      </button>
                      <button
                        onClick={() => onReject(req._id)}
                        className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  ) : req.geekResponseStatus === "Accepted" ? (
                    <button
                      onClick={() => handleClick(req)}
                      className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      View
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : null}
                </div>
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
  );
};

export default Request;
