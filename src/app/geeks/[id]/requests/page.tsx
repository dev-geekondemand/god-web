"use client";
import Request from "@/app/components/Request";
import { acceptRequest, getGeekRequests, rejectRequest } from "@/features/request/requestSlice";
import { ServiceRequest } from "@/interfaces/ServiceRequest";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Requests = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(getGeekRequests());
  }, [dispatch]);

  const requests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[];
  
  const handleAccept = (id: string) => {
    dispatch(acceptRequest(id));
    window.location.reload();
  };

  const handleReject = (id: string) => {
    dispatch(rejectRequest(id));
    window.location.reload();
  };


  
  

  return <section className="w-full h-full   flex flex-col items-center bg-gray-50 justify-center py-12">

    <div className="max-w-6xl w-full mx-auto  min-h-screen px-4 py-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 items-center justify-between">
          <h2 className="h2">Service Requests</h2>
        </div>

        <div className="w-full flex flex-col gap-4 items-center justify-center p-4">
            <Request requests={requests} onAccept={handleAccept} onReject={handleReject} />
        </div>
    </div>

  </section>
};

export default Requests;
