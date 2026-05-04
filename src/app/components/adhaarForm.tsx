// AadhaarVerificationForm.tsx
"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "../components/CustonInput";
import { useAppDispatch } from "@/lib/hooks";
import { verifyAdhaar } from "@/features/geek/geekSlice";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

interface AadhaarVerificationFormProps {
  status: string;
}

const AadhaarVerificationForm = ({ status }: AadhaarVerificationFormProps) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: { idNumber: "" },
    validationSchema: Yup.object({
      idNumber: Yup.string()
        .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
        .required("Aadhaar number is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(verifyAdhaar(values.idNumber));
      resetForm();
    },
  });

  useEffect(() => {
    toast.dismiss();
    if (status === "Requested") {
      toast.loading("Aadhaar verification in progress...");
      window.location.reload();
    } else if (status === "Verified") {
      toast.success("Aadhaar verification successful!");
      window.location.reload();
    } else if (status === "Failed") {
      toast.error("Last Aadhaar verification failed!");
    }
  }, [status]);

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Verify Aadhaar</h3>
          <p className="text-sm text-gray-500 mt-0.5">Enter your 12-digit Aadhaar number to verify your identity</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div>
          <CustomInput
            type="text"
            name="idNumber"
            placeholder="Enter 12-digit Aadhaar number"
            value={formik.values.idNumber}
            onChange={formik.handleChange}
            labelFor="idNumber"
            labelBg="bg-white"
            title="Aadhaar Number"
            required={true}
            disabled={false}
            readOnly={false}
          />
          {formik.touched.idNumber && formik.errors.idNumber && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.idNumber}</p>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Your Aadhaar details are used only for identity verification and are not stored.
        </p>

        <button
          type="submit"
          disabled={!formik.isValid || !formik.values.idNumber}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Submit for Verification
        </button>
      </form>
    </div>
  );
};

export default AadhaarVerificationForm;
