"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react"; // icons
import { useAppDispatch } from "@/lib/hooks";
import { GeekInitialState, verifyMail } from "@/features/geek/geekSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  console.log(params.token);
  const token = params.token as string;

  const [isGeekMailVerified, setIsGeekMailVerified] = useState(false);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
        dispatch(verifyMail(token))
    }
  }, [dispatch, token]);


  const geekState = useSelector((state: RootState) => state.geek);
  const { isError,isLoading,isMailVerified,message} = geekState as GeekInitialState;


  useEffect(() => {
    if (isMailVerified === true ){
      setTimeout(() => {
        router.push("/");
      }, 4000);
      setIsGeekMailVerified(true);
    }
  },[isMailVerified]);

  const handleRedirect = ()=>{
    if(isGeekMailVerified){
      setTimeout(() => {
        router.push("/geeks/dashboard");
      }, 2000);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        {isLoading && (
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

        {isGeekMailVerified  && (
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

        {isError && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button
              onClick={() => router.push("/")}
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
