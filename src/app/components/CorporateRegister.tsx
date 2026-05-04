"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { getCategories } from "@/features/category/categorySlice";
import { getBrandsByCategory } from "@/features/brands/brandsSlice";
import { sendGeekOTP } from "@/features/geek/geekSlice";
import { Multiselect } from "react-widgets/cjs";
import "react-widgets/styles.css";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Brand from "@/interfaces/Brand";
import { Category } from "@/interfaces/Category";
import PageBanner from "./PageBanner";

const validationSchema = Yup.object({
  phone: Yup.string().required("Phone is required").length(10, "Must be 10 digits"),
  firstName: Yup.string().required("First name is required").min(2, "Min 2 characters"),
  lastName: Yup.string(),
  companyName: Yup.string().required("Company name is required").min(2, "Min 2 characters"),
  category: Yup.string().required("Primary skill is required"),
  brands: Yup.array().min(1, "Select at least one brand"),
  yoe: Yup.number().min(0, "Cannot be negative").required("Years of experience is required"),
  refCode: Yup.string(),
});

const inputCls =
  "block w-full px-3.5 py-3 text-sm text-gray-900 bg-[#f6f6f6] rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";
const errorCls = "mt-1 text-xs text-red-500";

export default function CorporateRegister() {
  const dispatch = useAppDispatch();
  const query = useSearchParams();

  const categories = useSelector((state: RootState) => state.category.categories) as Category[];
  const brandsByCategory = useSelector((state: RootState) => state.brand.brandsByCategory?.brands) as Brand[];
  const geekState = useSelector((state: RootState) => state.geek);

  const formik = useFormik({
    initialValues: {
      phone: "",
      firstName: "",
      lastName: "",
      companyName: "",
      category: "",
      brands: [] as Brand[],
      yoe: 0,
      refCode: query.get("refCode") ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(sendGeekOTP(values.phone));
    },
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (formik.values.category) {
      dispatch(getBrandsByCategory(formik.values.category));
      formik.setFieldValue("brands", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.category, dispatch]);

  useEffect(() => {
    if (geekState.isAuthenticated) {
      toast.error("You are already logged in.");
      window.location.href = "/";
    }
  }, [geekState.isAuthenticated]);

  useEffect(() => {
    if (geekState.isSuccess && geekState.isOTPSent) {
      const { phone, firstName, lastName, companyName, category, yoe, brands, refCode } = formik.values;
      const brandIds = brands.map((b: Brand) => b._id);
      const params = new URLSearchParams({
        phone,
        firstName,
        lastName,
        companyName,
        category,
        yoe: String(yoe),
        refCode,
        brands: JSON.stringify(brandIds),
        context: "register",
        selected: "CorporateGeek",
      });
      window.location.href = `/verify-otp?${params.toString()}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geekState.isSuccess, geekState.isOTPSent]);

  const brandOptions = brandsByCategory?.map((b) => ({ name: b.name, _id: b._id })) ?? [];

  return (
    <section className="w-full min-h-screen flex flex-col bg-gray-50">

      <PageBanner
        title="Corporate Geek Registration"
        crumbs={[{ label: "Register", href: "/register" }, { label: "Corporate" }]}
      />

      {/* Registration type tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 flex items-center overflow-x-auto">
          <Link
            href="/register"
            className="px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-gray-800 whitespace-nowrap border-b-2 border-transparent hover:border-gray-300 transition"
          >
            Seeker
          </Link>
          <Link
            href="/register?type=geek"
            className="px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-gray-800 whitespace-nowrap border-b-2 border-transparent hover:border-gray-300 transition"
          >
            Individual Geek
          </Link>
          <span className="px-4 py-3.5 text-sm font-semibold text-teal-700 whitespace-nowrap border-b-2 border-teal-600">
            Corporate Geek
          </span>
          <div className="ml-auto pl-4 flex-shrink-0">
            <Link
              href="/login/geek"
              className="text-xs text-teal-600 hover:text-teal-700 whitespace-nowrap transition"
            >
              Already registered? Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-5">
          <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Company Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Company Details
              </h2>
              <div>
                <label className={labelCls}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Acme Technologies Pvt. Ltd."
                  type="text"
                  className={inputCls}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <p className={errorCls}>{formik.errors.companyName}</p>
                )}
              </div>
            </div>

            {/* Point of Contact */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Point of Contact
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ravi"
                      type="text"
                      className={inputCls}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className={errorCls}>{formik.errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      placeholder="Kumar"
                      type="text"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-lg overflow-hidden">
                    <span className="inline-flex items-center px-3.5 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg select-none">
                      +91
                    </span>
                    <input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="10-digit mobile number"
                      type="tel"
                      maxLength={10}
                      className="flex-1 px-3.5 py-3 text-sm text-gray-900 bg-[#f6f6f6] rounded-r-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition"
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <p className={errorCls}>{formik.errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Skills & Experience
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Primary Skill <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full px-3.5 py-3 text-sm text-gray-700 bg-[#f6f6f6] rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition"
                  >
                    <option value="">Select primary skill</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className={errorCls}>{formik.errors.category}</p>
                  )}
                </div>

                {formik.values.category && (
                  <div>
                    <label className={labelCls}>
                      Brands Serviced <span className="text-red-500">*</span>
                    </label>
                    <Multiselect
                      data={brandOptions}
                      dataKey="_id"
                      textField="name"
                      value={formik.values.brands?.map((b) => b._id)}
                      onChange={(value) => formik.setFieldValue("brands", value)}
                      placeholder="Select brands you service"
                    />
                    {formik.touched.brands && formik.errors.brands && (
                      <p className={errorCls}>
                        {Array.isArray(formik.errors.brands)
                          ? formik.errors.brands.join(", ")
                          : String(formik.errors.brands)}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className={labelCls}>
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="yoe"
                    value={formik.values.yoe}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="number"
                    min={0}
                    placeholder="0"
                    className={inputCls}
                  />
                  {formik.touched.yoe && formik.errors.yoe && (
                    <p className={errorCls}>{formik.errors.yoe}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Optional
              </h2>
              <div>
                <label className={labelCls}>Referral Code</label>
                <input
                  name="refCode"
                  value={formik.values.refCode}
                  onChange={formik.handleChange}
                  placeholder="Enter referral code"
                  type="text"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || geekState.isLoading}
              className="w-full py-3.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {geekState.isLoading ? "Sending OTP…" : "Get OTP & Continue →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 pb-6">
            By registering you agree to our{" "}
            <Link href="/terms-and-conditions" className="text-teal-600 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-teal-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
