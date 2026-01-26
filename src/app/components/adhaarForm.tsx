// AadhaarVerificationForm.tsx
"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "../components/CustonInput";
import { useAppDispatch } from "@/lib/hooks";
import { verifyAdhaar } from "@/features/geek/geekSlice"; // You’ll create this thunk
import toast from "react-hot-toast";

interface AadhaarVerificationFormProps {
  status: string;
}

const AadhaarVerificationForm = ({ status }: AadhaarVerificationFormProps) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      idNumber: "",
    },
    validationSchema: Yup.object({
      idNumber: Yup.string()
        .matches(/^\d{12}$/, "Aadhaar number must be 12 digits")
        .required("Aadhaar number is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(verifyAdhaar(values.idNumber));
      resetForm();
    },
  });

  useEffect(()=>{
    toast.dismiss();
    if(status === "Requested"){
      toast.loading("Aadhaar verification in progress...");
      window.location.reload();
    }else if(status === "Verified"){
      toast.success("Aadhaar verification successful!");
      window.location.reload();
    }else if(status === "Failed"){
      toast.error("Last Aadhaar verification failed!");
    }else{

    }
  },[status])

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-md p-6 rounded-lg flex flex-col items-start justify-center space-y-4"
    >
      <h2 className="text-xl font-semibold">Verify Aadhaar</h2>

      <CustomInput
        type="text"
        name="idNumber"
        placeholder="Enter 12-digit Aadhaar number"
        value={formik.values.idNumber}
        onChange={formik.handleChange}
        // onBlur={formik.handleBlur}
        labelFor="idNumber"
        labelBg=""
        title=""
        required={true}
        disabled={false}
        readOnly={false}
      />
      {formik.touched.idNumber && formik.errors.idNumber && (
        <p className="text-red-500 text-sm">{formik.errors.idNumber}</p>
      )}

      <button
        type="submit"
        disabled={!formik.isValid}
        className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default AadhaarVerificationForm;
