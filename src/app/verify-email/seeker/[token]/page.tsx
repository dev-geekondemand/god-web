"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react"; // icons
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { verifyMail } from "@/features/seeker/seekerSlice";

export default function VerifyEmailPage() {
  const router = useParams();
  console.log(router.token);
  const token = router.token as string;

  const [isSeekerMailVerified, setIsSeekerMailVerified] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
        setIsStatusLoading(true);
        dispatch(verifyMail(token))
    }
  }, [dispatch, token]);



  const seekerState = useSelector((state: RootState) => state.seeker);

  useEffect(() => {
    if(seekerState.isMailVerified === true){
      setTimeout(() => {
        window.location.href = "/";
      }, 4000);
      setIsSeekerMailVerified(true);
      setIsStatusLoading(false);
    }

    if(seekerState?.isError === true && seekerState?.isMailVerified === false){
        setIsSeekerMailVerified(false);
        setIsStatusLoading(false);
    }
  },[seekerState.isMailVerified,seekerState.isError]);


  const handleRedirect = ()=>{
    if(isSeekerMailVerified){
      setTimeout(() => {
        window.location.href = seekerState?.user?._id ?  `/seeker/${seekerState?.user?._id}` : "/";
      }, 2000);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        {isStatusLoading && (
          <>
            <Loader2 className="animate-spin w-12 h-12 text-blue-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              Verifying your email...
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {seekerState.isMailVerified && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-green-600">
              Email Verified Successfully 🎉
            </h2>
            <p className="text-gray-500 mt-2">
              You’ll be redirected to home in a moment...
            </p>
            <button
              onClick={handleRedirect}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Profile
            </button>
          </>
        )}

        {seekerState.isError && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-500 mt-2">{seekerState.errorMessage}</p>
            <button
              onClick={() =>window.location.href = "/"}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
