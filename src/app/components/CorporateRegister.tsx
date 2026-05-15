"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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

// GSTIN: 2 digits + 5 alpha + 4 digits + 1 alpha + 1 alphanumeric + Z + 1 alphanumeric
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
// CIN: L/U + 5 digits + 2 alpha (state) + 4 digits (year) + 3 alpha (company type) + 6 digits
const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}(PLC|PTC|NPL|OPC|GOI|FLC|FTC|FRN)[0-9]{6}$/;

// Maps GSTIN numeric state code -> MCA CIN alpha state code(s)
const GSTIN_STATE_TO_CIN: Record<string, string[]> = {
  "01": ["JK"], "02": ["HP"], "03": ["PB"], "04": ["CH"], "05": ["UT"],
  "06": ["HR"], "07": ["DL"], "08": ["RJ"], "09": ["UP"], "10": ["BR"],
  "11": ["SK"], "12": ["AR"], "13": ["NL"], "14": ["MN"], "15": ["MZ"],
  "16": ["TR"], "17": ["ML"], "18": ["AS"], "19": ["WB"], "20": ["JH"],
  "21": ["OR"], "22": ["CG"], "23": ["MP"], "24": ["GJ"], "25": ["DD"],
  "26": ["DN"], "27": ["MH"], "28": ["AP"], "29": ["KA"], "30": ["GA"],
  "31": ["LD"], "32": ["KL"], "33": ["TN"], "34": ["PY"], "35": ["AN"],
  "36": ["TG", "AP"], "37": ["AP", "TG"], "38": ["LA"],
};

type VerifyStatus = "idle" | "loading" | "verified" | "mismatch" | "api_error";

function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/private\s+limited/gi, "pvt ltd")
    .replace(/pvt\.?\s*ltd\.?/gi, "pvt ltd")
    .replace(/public\s+limited/gi, "ltd")
    .replace(/\blimited\b/gi, "ltd")
    .replace(/\band\b/gi, "&")
    .replace(/[^a-z0-9\s&]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(apiName: string, formName: string): boolean {
  const a = normalizeCompanyName(apiName);
  const b = normalizeCompanyName(formName);
  return a === b || a.includes(b) || b.includes(a);
}

const validationSchema = Yup.object({
  phone: Yup.string().required("Phone is required").length(10, "Must be 10 digits"),
  firstName: Yup.string().required("First name is required").min(2, "Min 2 characters"),
  lastName: Yup.string(),
  companyName: Yup.string().required("Company name is required").min(2, "Min 2 characters"),
  gstin: Yup.string()
    .required("GSTIN is required")
    .matches(GSTIN_REGEX, "Invalid GSTIN format (e.g. 27AABCU9603R1ZX)"),
  cin: Yup.string()
    .required("CIN is required")
    .matches(CIN_REGEX, "Invalid CIN format (e.g. L17110MH1973PLC019786)"),
  category: Yup.string().required("Primary skill is required"),
  brands: Yup.array().min(1, "Select at least one brand"),
  yoe: Yup.number().min(0, "Cannot be negative").required("Years of experience is required"),
  refCode: Yup.string(),
});

const inputCls =
  "block w-full px-3.5 py-3 text-sm text-gray-900 bg-[#f6f6f6] rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";
const errorCls = "mt-1 text-xs text-red-500";

function VerifyBadge({ status, message }: { status: VerifyStatus; message: string }) {
  if (status === "idle") return null;
  if (status === "loading")
    return <span className="mt-1.5 flex items-center gap-1 text-xs text-gray-500"><svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Verifying…</span>;
  if (status === "verified")
    return <span className="mt-1.5 flex items-center gap-1 text-xs text-green-600">✓ {message}</span>;
  if (status === "mismatch")
    return <span className="mt-1.5 flex items-center gap-1 text-xs text-red-500">✗ {message}</span>;
  // api_error
  return <span className="mt-1.5 flex items-center gap-1 text-xs text-amber-600">⚠ {message}</span>;
}

export default function CorporateRegister() {
  const dispatch = useAppDispatch();
  const query = useSearchParams();

  const categories = useSelector((state: RootState) => state.category.categories) as Category[];
  const brandsByCategory = useSelector((state: RootState) => state.brand.brandsByCategory?.brands) as Brand[];
  const geekState = useSelector((state: RootState) => state.geek);
  console.log(categories);
  

  const [gstinStatus, setGstinStatus] = useState<VerifyStatus>("idle");
  const [gstinMsg, setGstinMsg] = useState("");
  const [gstinPortalName, setGstinPortalName] = useState("");
  const [gstinCaptcha, setGstinCaptcha] = useState<{ image: string; sessionId: string } | null>(null);
  const [gstinCaptchaInput, setGstinCaptchaInput] = useState("");
  const [cinStatus, setCinStatus] = useState<VerifyStatus>("idle");
  const [cinMsg, setCinMsg] = useState("");
  const [crossStatus, setCrossStatus] = useState<"idle" | "verified" | "mismatch">("idle");
  const [crossMsg, setCrossMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      phone: "",
      firstName: "",
      lastName: "",
      companyName: "",
      gstin: "",
      cin: "",
      category: "",
      brands: [] as Brand[],
      yoe: 0,
      refCode: query.get("refCode") ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (gstinStatus === "mismatch") {
        toast.error("GSTIN company name does not match. Please correct before proceeding.");
        return;
      }
      if (cinStatus === "mismatch") {
        toast.error("CIN company name does not match. Please correct before proceeding.");
        return;
      }
      if (gstinStatus === "idle") {
        toast.error("Please verify your GSTIN before continuing.");
        return;
      }
      if (cinStatus === "idle") {
        toast.error("Please verify your CIN before continuing.");
        return;
      }
      if (crossStatus === "mismatch") {
        toast.error("GSTIN and CIN cross-verification failed. Please check your details.");
        return;
      }
      dispatch(sendGeekOTP(values.phone));
    },
  });

  // Reset verify status when GSTIN/CIN field changes
  useEffect(() => {
    setGstinStatus("idle");
    setGstinMsg("");
    setGstinPortalName("");
    setGstinCaptcha(null);
    setGstinCaptchaInput("");
    setCrossStatus("idle");
    setCrossMsg("");
  }, [formik.values.gstin]);

  useEffect(() => {
    setCinStatus("idle");
    setCinMsg("");
    setCrossStatus("idle");
    setCrossMsg("");
  }, [formik.values.cin]);

  // Reset verify status when company name changes (mismatch may become valid)
  useEffect(() => {
    if (gstinStatus === "mismatch" || cinStatus === "mismatch") {
      setGstinStatus("idle");
      setGstinMsg("");
      setGstinPortalName("");
      setCinStatus("idle");
      setCinMsg("");
    }
    setCrossStatus("idle");
    setCrossMsg("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.companyName]);

  // Cross-verify GSTIN and CIN once both are individually verified
  useEffect(() => {
    if (gstinStatus !== "verified" || cinStatus !== "verified" || !gstinPortalName) {
      if (gstinStatus !== "loading" && cinStatus !== "loading") {
        setCrossStatus("idle");
        setCrossMsg("");
      }
      return;
    }
    const gstStateCode = formik.values.gstin.substring(0, 2);
    const cinStateCode = formik.values.cin.substring(6, 8);
    const validCinCodes = GSTIN_STATE_TO_CIN[gstStateCode] ?? [];

    if (!validCinCodes.includes(cinStateCode)) {
      setCrossStatus("mismatch");
      setCrossMsg(
        `State mismatch — GSTIN state "${gstStateCode}" does not correspond to CIN state "${cinStateCode}". Both must be from the same state.`
      );
    } else if (!namesMatch(gstinPortalName, formik.values.companyName)) {
      setCrossStatus("mismatch");
      setCrossMsg(`Company name mismatch — GST portal shows "${gstinPortalName}" but entered name differs.`);
    } else {
      setCrossStatus("verified");
      setCrossMsg(`GSTIN and CIN are consistent — same state, company name matches GST portal.`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gstinStatus, cinStatus, gstinPortalName]);

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
      const { phone, firstName, lastName, companyName, gstin, cin, category, yoe, brands, refCode } = formik.values;
      const brandIds = brands.map((b: Brand) => b._id);
      const params = new URLSearchParams({
        phone,
        firstName,
        lastName,
        companyName,
        gstin,
        cin,
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

  // Step 1 — fetch captcha from GST portal (establishes session)
  async function fetchGstinCaptcha() {
    const gstin = formik.values.gstin.trim().toUpperCase();
    if (!GSTIN_REGEX.test(gstin)) {
      toast.error("Enter a valid GSTIN format first.");
      return;
    }

    // Quick checksum check before hitting the server
    setGstinStatus("loading");
    try {
      const check = await fetch(`/api/verify-gstin?gstin=${gstin}`);
      const checkData = await check.json();
      if (check.status === 400) {
        setGstinStatus("mismatch");
        setGstinMsg(checkData.error || "Invalid GSTIN");
        return;
      }
    } catch {
      setGstinStatus("api_error");
      setGstinMsg("Could not validate GSTIN format");
      return;
    }

    try {
      const res = await fetch("/api/gstin-captcha");
      const data = await res.json();
      if (!res.ok || data.error) {
        setGstinStatus("api_error");
        setGstinMsg(data.error || "Failed to load captcha — GST portal unreachable");
        return;
      }
      setGstinCaptcha({ image: data.image, sessionId: data.sessionId });
      setGstinCaptchaInput("");
      setGstinStatus("idle");
      setGstinMsg("");
    } catch {
      setGstinStatus("api_error");
      setGstinMsg("Failed to load captcha — check your connection");
    }
  }

  // Step 2 — submit captcha answer to GST portal and match company name
  async function verifyGstin() {
    if (!gstinCaptcha || !gstinCaptchaInput.trim()) {
      toast.error("Enter the captcha text first.");
      return;
    }
    const companyName = formik.values.companyName.trim();
    if (!companyName) {
      toast.error("Enter company name before verifying.");
      return;
    }

    setGstinStatus("loading");
    try {
      const res = await fetch("/api/verify-gstin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gstin: formik.values.gstin.trim().toUpperCase(),
          sessionId: gstinCaptcha.sessionId,
          captcha: gstinCaptchaInput.trim(),
        }),
      });
      const data = await res.json();

      if (res.status === 400) {
        setGstinCaptcha(null);
        setGstinStatus("mismatch");
        setGstinMsg(data.error || "GSTIN verification failed");
        return;
      }
      if (res.status === 422) {
        // Wrong captcha — refresh it so user can try again immediately
        setGstinCaptchaInput("");
        setGstinStatus("idle");
        setGstinMsg("");
        toast.error(data.error || "Wrong captcha — a new one has been loaded");
        fetchGstinCaptcha();
        return;
      }
      setGstinCaptcha(null);
      if (res.status === 404) {
        setGstinStatus("api_error");
        setGstinMsg(data.error || "GSTIN not found in GST records");
        return;
      }
      if (!res.ok) {
        setGstinStatus("api_error");
        setGstinMsg(data.error || "GST portal unreachable — try again");
        return;
      }

      const portalName: string = data.legalName || data.tradeName || "";
      if (!portalName) {
        setGstinStatus("api_error");
        setGstinMsg("Could not retrieve company name from GST portal");
        return;
      }
      setGstinPortalName(portalName);
      if (namesMatch(portalName, companyName)) {
        setGstinStatus("verified");
        setGstinMsg(`Verified: ${portalName} (${data.status || "Active"})`);
      } else {
        setGstinStatus("mismatch");
        setGstinMsg(`Company name mismatch. Portal shows: "${portalName}"`);
      }
    } catch {
      setGstinStatus("api_error");
      setGstinMsg("Verification request failed — check your connection");
      setGstinCaptcha(null);
    }
  }

  // CIN — structural validation (format + state code + year); MCA has no public API
  async function verifyCin() {
    const cin = formik.values.cin.trim().toUpperCase();
    if (!CIN_REGEX.test(cin)) {
      toast.error("Enter a valid CIN before verifying.");
      return;
    }

    setCinStatus("loading");
    setCinMsg("");
    try {
      const res = await fetch(`/api/verify-cin?cin=${cin}`);
      const data = await res.json();
      if (res.status === 400) {
        setCinStatus("mismatch");
        setCinMsg(data.error || "CIN verification failed");
        return;
      }
      // Structural validation passed
      setCinStatus("verified");
      setCinMsg(data.message || "CIN structure verified (state code & year valid)");
    } catch {
      setCinStatus("api_error");
      setCinMsg("Verification request failed — check your connection");
    }
  }

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
              <div className="space-y-4">
                {/* Company Name */}
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

                {/* GSTIN */}
                <div>
                  <label className={labelCls}>
                    GSTIN <span className="text-red-500">*</span>
                    <span className="ml-1 text-xs font-normal text-gray-400">(GST Identification Number)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="gstin"
                      value={formik.values.gstin}
                      onChange={(e) => formik.setFieldValue("gstin", e.target.value.toUpperCase())}
                      onBlur={formik.handleBlur}
                      placeholder="27AABCU9603R1ZX"
                      type="text"
                      maxLength={15}
                      className={`${inputCls} flex-1 font-mono tracking-wider`}
                    />
                    {!gstinCaptcha && (
                      <button
                        type="button"
                        onClick={fetchGstinCaptcha}
                        disabled={gstinStatus === "loading" || !GSTIN_REGEX.test(formik.values.gstin)}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                      >
                        {gstinStatus === "loading" ? "…" : "Get Captcha"}
                      </button>
                    )}
                  </div>

                  {/* Captcha UI — shown after step 1 */}
                  {gstinCaptcha && gstinStatus !== "verified" && gstinStatus !== "mismatch" && (
                    <div className="mt-2.5 p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <img src={gstinCaptcha.image} alt="GST captcha" className="h-10 rounded border border-gray-200" />
                        <button
                          type="button"
                          onClick={fetchGstinCaptcha}
                          className="text-xs text-teal-600 hover:underline"
                        >
                          ↻ Refresh
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={gstinCaptchaInput}
                          onChange={(e) => setGstinCaptchaInput(e.target.value)}
                          placeholder="Enter captcha text shown above"
                          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition"
                        />
                        <button
                          type="button"
                          onClick={verifyGstin}
                          disabled={gstinStatus === "loading" || !gstinCaptchaInput.trim()}
                          className="px-4 py-2 text-xs font-semibold rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                        >
                          {gstinStatus === "loading" ? "…" : "Verify"}
                        </button>
                      </div>
                    </div>
                  )}

                  {formik.touched.gstin && formik.errors.gstin && (
                    <p className={errorCls}>{formik.errors.gstin}</p>
                  )}
                  <VerifyBadge status={gstinStatus} message={gstinMsg} />
                </div>

                {/* CIN */}
                <div>
                  <label className={labelCls}>
                    CIN <span className="text-red-500">*</span>
                    <span className="ml-1 text-xs font-normal text-gray-400">(Corporate Identification Number)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="cin"
                      value={formik.values.cin}
                      onChange={(e) => formik.setFieldValue("cin", e.target.value.toUpperCase())}
                      onBlur={formik.handleBlur}
                      placeholder="L17110MH1973PLC019786"
                      type="text"
                      maxLength={21}
                      className={`${inputCls} flex-1 font-mono tracking-wider`}
                    />
                    <button
                      type="button"
                      onClick={verifyCin}
                      disabled={cinStatus === "loading" || !CIN_REGEX.test(formik.values.cin)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                    >
                      {cinStatus === "loading" ? "Verifying…" : "Verify"}
                    </button>
                  </div>
                  {formik.touched.cin && formik.errors.cin && (
                    <p className={errorCls}>{formik.errors.cin}</p>
                  )}
                  <VerifyBadge status={cinStatus} message={cinMsg} />
                </div>

                {/* Cross-verification result */}
                {crossStatus !== "idle" && (
                  <div className={`mt-1 flex items-start gap-2 p-3 rounded-lg text-xs border ${
                    crossStatus === "verified"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}>
                    <span className="mt-0.5 shrink-0">{crossStatus === "verified" ? "✓" : "✗"}</span>
                    <span><strong>Cross-check:</strong> {crossMsg}</span>
                  </div>
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
