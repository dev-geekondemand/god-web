"use client";
import Request from "@/app/components/Request";
import { acceptRequest, getGeekRequests, rejectRequest } from "@/features/request/requestSlice";
import { ServiceRequest } from "@/interfaces/ServiceRequest";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import PageBanner from "@/app/components/PageBanner";
import { useSelector } from "react-redux";


const Requests = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getGeekRequests());
    const onVisible = () => {
      if (document.visibilityState === "visible") dispatch(getGeekRequests());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [dispatch]);

  const requests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[];

  const handleAccept = async (id: string) => {
    await dispatch(acceptRequest(id));
    dispatch(getGeekRequests());
  };

  const handleReject = async (id: string) => {
    await dispatch(rejectRequest(id));
    dispatch(getGeekRequests());
  };

  return (
    <section className="w-full h-full flex flex-col items-center bg-gray-50 justify-center">
      <PageBanner
        title="Service Requests"
        crumbs={[
          { label: 'Dashboard', href: '/geeks/dashboard' },
          { label: 'Service Requests' },
        ]}
      />

      <div className="max-w-6xl w-full mx-auto min-h-screen px-4 py-8 flex flex-col gap-4">
        <Request requests={requests} onAccept={handleAccept} onReject={handleReject} />
      </div>
    </section>
  );
};

export default Requests;
