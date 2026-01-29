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

const Request: React.FC<RequestProps> = ({ requests,onAccept, onReject  }) => {

  const router = useRouter();
  const dispatch = useAppDispatch();
const [openIssueId, setOpenIssueId] = React.useState<string | null>(null);

  const azureLoader = ({ src }:{src:string}) => src;

  const curGeek = useSelector((state: RootState) => state.geek.geek) as Geek;

  useEffect(()=>{
    if(!curGeek?._id){
      dispatch(loadGeek());
    }
  },[dispatch,curGeek?._id]);

  const hoursLeft = (date: Date) => {
    const now = new Date();
    const timeDiff =  now.getTime() - date.getTime();
    const hoursRemaining = Math.ceil(timeDiff / (1000 * 60 * 60));
  
    return 24 - hoursRemaining;
  }

  const minutesLeft = (date: Date) => {
    const now = new Date();
    const timeDiff =  now.getTime() - date.getTime();
    const minutesRemaining = Math.ceil(timeDiff / (1000 * 60));

    
    return 60 - minutesRemaining;
  }
  

  const handleClick = ( req: ServiceRequest) => {
    const requestId = req?._id;
    if(requestId && req?.geekResponseStatus === "Accepted" ) {
      router.push(`/geeks/${curGeek?._id}/requests/${requestId}`);
    }else{
      toast.error("Only Accepted requests can be viewed.");
    }
  };





  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-4">
      <div
            hidden={!openIssueId}
            onClick={() => setOpenIssueId(null)}
            className="fixed inset-0 bg-gray-200 opacity-90 z-40 transition-opacity duration-300"
          />

          {/* Modal */}
          {openIssueId && (
            <div className="fixed top-25 bottom-15 left-0 right-0 z-50 max-w-3xl mx-auto overflow-y-scroll bg-white shadow-lg rounded-lg p-6">
              <Issue userIssue={requests.find(r => r._id === openIssueId)?.issue} />
            </div>
          )}
      {requests.map((req) => (
        <div
          key={req._id}
          className={`p-8 rounded-xl border bg-white shadow-md transition duration-200 ${
            req.geekResponseStatus === "Pending" ? " border-teal-300" : "bg-white border-gray-200"
          }`}
        >
          <div   className="flex  justify-between items-center gap-2">
            <div onClick={()=>{handleClick(req)}} className="flex cursor-pointer justify-center items-center">
              <Image 
               
                loader={azureLoader}
                width={100}
                height={100}
                className="w-44 rounded-md"
                src={req.category?.image?.url || "/assets/images/blogImg.jpg"}
                alt="Service Image"
              />
            </div>
           
            <div className="flex flex-col justify-center items-start">
              <h3 className="text-lg font-semibold">Service Request for {req?.category?.title}</h3>
              {req.geekResponseStatus === "Accepted" ? <HoverCardComponent 
                linkText={"From: " + req.seeker?.fullName?.first + " " + req.seeker?.fullName?.last}
                avatarImg={req.seeker.profileImage}
                title={"Name: " + req?.seeker?.fullName?.first + " " + req?.seeker?.fullName?.last}
                line1={req.seeker?.authProvider === "google" || req.seeker?.authProvider === "microsoft" ? "Email: " + req?.seeker?.email : "Phone: " + req?.seeker?.phone}
                line2={"Joined on: " + new Date(req?.seeker?.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}
                mutedLine={req?.seeker?.address?.line1 ? "Address: " + req?.seeker?.address?.line1 + ", " + req?.seeker?.address?.line2 + ", " + req?.seeker?.address?.line3 : ""}
              /> : <p>Accept request to see seeker details.</p>}
              <p className="text-sm flex  gap-2 text-gray-500 mt-1 mb-2">Requested on: {new Date(req.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' , hour: 'numeric', minute: 'numeric'})} 
                {/* <span className={`text-sm ${hoursLeft(new Date(req.createdAt)) > 0 ? "text-teal-600" : minutesLeft(new Date(req.createdAt)) > 0 ? "text-yellow-500" : "text-red-500"}`}>{ req.geekResponseStatus === "Pending" && hoursLeft(new Date(req.createdAt)) > 0 ? `(${hoursLeft(new Date(req.createdAt))} hours left)` : minutesLeft(new Date(req.createdAt)) > 0 ? req.geekResponseStatus === "Pending" && `( ${  minutesLeft(new Date(req.createdAt))} minutes left)` : "Expired"}</span> */} </p> 
              <p className="flex text-sm items-center gap-2 mt-1 text-gray-500">Status: <span className={`text-sm ${req.status === "Pending" || req.status === "Matched" ? "text-teal-600" : req.status === "Rejected" || req.status === "Cancelled" ? "text-red-500" : "text-green-500"}`}>{req.status}</span></p>

              {req?.issue && (
                  <div className="text-sm flex gap-2 text-gray-500 mt-1 mb-2">
                    Issue:{" "}
                    <button
                      onClick={() => setOpenIssueId(req._id)}
                      className="underline cursor-pointer text-teal-600"
                    >
                      Open User Issue
                    </button>
                  </div>
                )}


            </div>
            { (hoursLeft(new Date(req.createdAt)) >= 0 || minutesLeft(new Date(req.createdAt)) >= 0 ) && req.geekResponseStatus === "Pending" ? <div className="flex gap-2 justify-center items-start">
              <button
                onClick={()=>{onAccept(req._id)}}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
              >
                Accept
              </button> 
              <button
                onClick={()=>{onReject(req._id)}}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
            : <div className="">
                <p className="text-sm text-red-500"><span className={`${req?.geekResponseStatus !== "Accepted" &&  minutesLeft(new Date(req.createdAt)) < 0 ? "text-red-500" : req.geekResponseStatus === "Pending" ? "text-teal-600" : req.geekResponseStatus === "Accepted" ? "text-green-500" : "text-red-500"}`}>Request {req?.geekResponseStatus ===  "Accepted" ? "Accepted" : hoursLeft(new Date(req.createdAt)) <= 0 && minutesLeft(new Date(req.createdAt)) <= 0  &&  req?.status !== "Matched" || req?.status !== "Completed" ? "Expired" : req.status}</span></p>
            </div>
            }
          </div>
        </div>
      ))}

      {requests.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-6">No service requests found.</div>
      )}
    </div>
  );
};

export default Request;
