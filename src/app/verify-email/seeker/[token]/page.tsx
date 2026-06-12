"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { verifyMail } from "@/features/seeker/seekerSlice";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const dispatch = useAppDispatch();
  const seekerState = useSelector((state: RootState) => state.seeker);

  useEffect(() => {
    if (!token) return;
    dispatch(verifyMail(token))
      .unwrap()
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          router.push(seekerState?.user?._id ? `/seeker/${seekerState.user._id}` : "/");
        }, 3000);
      })
      .catch((err) => {
        const msg =
          typeof err === "string"
            ? err
            : err?.message || "The link may be invalid or expired.";
        setErrorMsg(msg);
        setStatus("error");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const goToProfile = () =>
    router.push(seekerState?.user?._id ? `/seeker/${seekerState.user._id}` : "/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin w-12 h-12 text-teal-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              Verifying your email...
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-green-600">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-500 mt-2">
              You&apos;ll be redirected to your profile in a moment...
            </p>
            <button
              onClick={goToProfile}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Go to Profile
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-lg font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-500 mt-2">{errorMsg}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
