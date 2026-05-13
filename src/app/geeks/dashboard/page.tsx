// GeekDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { getBrands } from "@/features/brands/brandsSlice";
import { getCategories } from "@/features/category/categorySlice";
import CustomInput from "@/app/components/CustonInput";
import Geek from "@/interfaces/Geek";
import { Category } from "@/interfaces/Category";
import {
  BadgeCheck,
  Building2,
  OctagonX,
  Pencil,
  Plus,
  Trash2,
  X,
  MapPin,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Multiselect } from "react-widgets";
import "react-widgets/styles.css";
import {
  deleteRateCard,
  sendVerificationMail,
  updateGeekProfile,
  verificationStatus,
} from "@/features/geek/geekSlice";

// ── GST/CIN helpers ───────────────────────────────────────────────────────────
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}(PLC|PTC|NPL|OPC|GOI|FLC|FTC|FRN)[0-9]{6}$/;
type VerifyStatus = "idle" | "loading" | "verified" | "mismatch" | "api_error";

function normalizeCompanyName(name: string): string {
  return name.toLowerCase()
    .replace(/private\s+limited/gi, "pvt ltd").replace(/pvt\.?\s*ltd\.?/gi, "pvt ltd")
    .replace(/public\s+limited/gi, "ltd").replace(/\blimited\b/gi, "ltd")
    .replace(/\band\b/gi, "&").replace(/[^a-z0-9\s&]/g, "").replace(/\s+/g, " ").trim();
}
function namesMatch(a: string, b: string) {
  const na = normalizeCompanyName(a), nb = normalizeCompanyName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

function VerifyBadge({ status, message }: { status: VerifyStatus; message: string }) {
  if (status === "idle") return null;
  if (status === "loading") return <span className="mt-1 flex items-center gap-1 text-xs text-gray-500"><svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Verifying…</span>;
  if (status === "verified") return <span className="mt-1 flex items-center gap-1 text-xs text-green-600">✓ {message}</span>;
  if (status === "mismatch") return <span className="mt-1 flex items-center gap-1 text-xs text-red-500">✗ {message}</span>;
  return <span className="mt-1 flex items-center gap-1 text-xs text-amber-600">⚠ {message}</span>;
}
import AadhaarVerificationForm from "@/app/components/adhaarForm";
import AddressForm from "@/app/components/AddressForm";
import ProfileImageUpload from "@/app/components/ImageUpload";
import ProfileImage from "@/app/components/ProfileImage";
import RateCardSection from "@/app/components/RateCard";
import Brand from "@/interfaces/Brand";
import GlobalSkeleton from "@/app/components/Sekeletn";

interface SkillWithBrands {
  categoryId: string;
  brands: Brand[];
}

const Languages = [
  "English","Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu",
  "Gujarati", "Kannada", "Odia", "Malayalam", "Punjabi",
  "Assamese", "Maithili", "Santali", "Kashmiri", "Nepali",
  "Konkani", "Sindhi", "Dogri", "Manipuri"
];

// ── Shared modal shell ─────────────────────────────────────────────────────────
const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = "max-w-lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 z-50" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Body — scrollable */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const dispatch = useAppDispatch();

  // modal open states
  const [openProfile, setOpenProfile] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openAdhaarForm, setOpenAdhaarForm] = useState(false);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openRateCard, setOpenRateCard] = useState(false);
  const [openCompanyDetails, setOpenCompanyDetails] = useState(false);

  // loading states
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingSkills, setUpdatingSkills] = useState(false);
  const [updatingCompany, setUpdatingCompany] = useState(false);

  // GSTIN / CIN verify states (for company modal)
  const [gstinStatus, setGstinStatus] = useState<VerifyStatus>("idle");
  const [gstinMsg, setGstinMsg] = useState("");
  const [cinStatus, setCinStatus] = useState<VerifyStatus>("idle");
  const [cinMsg, setCinMsg] = useState("");

  const [isMailSent, setIsMailSent] = useState(false);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [tempSkill, setTempSkill] = useState<SkillWithBrands>({ categoryId: "", brands: [] });

  const geekState = useSelector((state: RootState) => state.geek);
  const geek: Geek = useSelector((state: RootState) => state.geek?.geek as Geek);
  const geekId = geek?._id;
  const brands = useSelector((state: RootState) => state.brand?.brands) as Brand[];
  const categories = useSelector((state: RootState) => state.category?.categories) as Category[];

  const isCorporate = geek?.__t === "Corporate" || geek?.companyName;

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getCategoryById = (cats: Category[], id?: string) => cats.find(c => c._id === id);
  const getBrandsByCategoryId = (b: Brand[], categoryId?: string) =>
    b.filter(br => br.category?._id === categoryId);
  const isSecondaryCategoryAdded = (skills: SkillWithBrands[], categoryId: string) =>
    skills.some(s => s.categoryId === categoryId);

  // ── Profile formik (personal info only) ──────────────────────────────────────
  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: geek?.fullName?.first || "",
      lastName: geek?.fullName?.last || "",
      email: geek?.email || "",
      mobile: geek?.mobile || "",
      yoe: geek?.yoe,
      modeOfService: geek?.modeOfService || "",
      languagePreferences: geek?.languagePreferences || [],
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      yoe: Yup.number().min(0, "Must be positive").required("Experience is required"),
      modeOfService: Yup.string().required("Mode of service is required"),
      languagePreferences: Yup.array().min(1, "At least one language is required"),
    }),
    onSubmit: async (values) => {
      try {
        setUpdatingProfile(true);
        await dispatch(updateGeekProfile({
          id: geekId,
          data: {
            fullName: { first: values.firstName, last: values.lastName },
            email: values.email,
            mobile: values.mobile,
            yoe: values.yoe,
            modeOfService: values.modeOfService,
            languagePreferences: values.languagePreferences,
          },
        })).unwrap();
      } catch (error: Error | unknown) {
        if (error instanceof Error) toast.error(error.message);
        else console.error("Unknown error:", error);
      } finally {
        setUpdatingProfile(false);
      }
    },
  });

  // ── Skills formik (primary + secondary skills & brands) ───────────────────────
  const skillsFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      primarySkill: {
        categoryId: geek?.primarySkill?._id || "",
        brands: geek?.brandsServiced?.filter((b: Brand) => b?.category?._id === geek?.primarySkill?._id) || [],
      },
      secondarySkills: (geek?.secondarySkills || []).map((cat: Category) => ({
        categoryId: cat._id,
        brands: geek?.brandsServiced?.filter((b: Brand) => b?.category?._id === cat._id) || [],
      })),
    },
    validationSchema: Yup.object({
      primarySkill: Yup.object({
        categoryId: Yup.string().required("Primary skill is required"),
        brands: Yup.array().min(1, "Select at least one brand"),
      }),
      secondarySkills: Yup.array().of(
        Yup.object({
          categoryId: Yup.string().required(),
          brands: Yup.array().min(1, "Select at least one brand"),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        setUpdatingSkills(true);
        const allBrands = [
          ...values.primarySkill.brands,
          ...values.secondarySkills.flatMap(s => s.brands),
        ];
        await dispatch(updateGeekProfile({
          id: geekId,
          data: {
            primarySkill: values.primarySkill.categoryId,
            secondarySkills: values.secondarySkills.map(s => s.categoryId),
            brandsServiced: Array.from(new Map(allBrands.map(b => [b._id, b])).values()).map(b => b._id),
          },
        })).unwrap();
      } catch (error: Error | unknown) {
        if (error instanceof Error) toast.error(error.message);
        else console.error("Unknown error:", error);
      } finally {
        setUpdatingSkills(false);
      }
    },
  });

  // ── Company Details formik (GSTIN + CIN, corporate only) ────────────────────
  const companyFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      GSTIN: geek?.GSTIN || "",
      CIN: geek?.CIN || "",
    },
    validationSchema: Yup.object({
      GSTIN: Yup.string().matches(GSTIN_REGEX, "Invalid GSTIN format (e.g. 27AABCU9603R1ZX)"),
      CIN: Yup.string().matches(CIN_REGEX, "Invalid CIN format (e.g. L17110MH1973PLC019786)"),
    }),
    onSubmit: async (values) => {
      if (gstinStatus === "mismatch" || cinStatus === "mismatch") {
        toast.error("Company name mismatch — correct before saving.");
        return;
      }
      try {
        setUpdatingCompany(true);
        await dispatch(updateGeekProfile({
          id: geekId,
          data: { GSTIN: values.GSTIN || undefined, CIN: values.CIN || undefined },
        })).unwrap();
        setOpenCompanyDetails(false);
      } catch (error: Error | unknown) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setUpdatingCompany(false);
      }
    },
  });

  // Reset verify + captcha state when fields change in company modal
  const [gstinCaptchaD, setGstinCaptchaD] = useState<{ image: string; sessionId: string } | null>(null);
  const [gstinCaptchaInputD, setGstinCaptchaInputD] = useState("");
  useEffect(() => { setGstinStatus("idle"); setGstinMsg(""); setGstinCaptchaD(null); setGstinCaptchaInputD(""); }, [companyFormik.values.GSTIN]);
  useEffect(() => { setCinStatus("idle"); setCinMsg(""); }, [companyFormik.values.CIN]);

  // Step 1 — load captcha for the GST portal
  async function fetchGstinCaptchaD() {
    const gstin = companyFormik.values.GSTIN.trim().toUpperCase();
    if (!GSTIN_REGEX.test(gstin)) { toast.error("Enter a valid GSTIN first."); return; }
    setGstinStatus("loading");
    try {
      const check = await fetch(`/api/verify-gstin?gstin=${gstin}`);
      const checkData = await check.json();
      if (check.status === 400) { setGstinStatus("mismatch"); setGstinMsg(checkData.error || "Invalid GSTIN"); return; }
    } catch { setGstinStatus("api_error"); setGstinMsg("Could not validate GSTIN format"); return; }
    try {
      const res = await fetch("/api/gstin-captcha");
      const data = await res.json();
      if (!res.ok || data.error) { setGstinStatus("api_error"); setGstinMsg(data.error || "Failed to load captcha"); return; }
      setGstinCaptchaD({ image: data.image, sessionId: data.sessionId });
      setGstinCaptchaInputD(""); setGstinStatus("idle"); setGstinMsg("");
    } catch { setGstinStatus("api_error"); setGstinMsg("Failed to load captcha"); }
  }

  // Step 2 — submit captcha and verify company name
  async function verifyGstinDashboard() {
    if (!gstinCaptchaD || !gstinCaptchaInputD.trim()) { toast.error("Enter the captcha text first."); return; }
    const companyName = geek?.companyName || "";
    setGstinStatus("loading");
    try {
      const res = await fetch("/api/verify-gstin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin: companyFormik.values.GSTIN.trim().toUpperCase(), sessionId: gstinCaptchaD.sessionId, captcha: gstinCaptchaInputD.trim() }),
      });
      const data = await res.json();
      setGstinCaptchaD(null);
      if (res.status === 400) { setGstinStatus("mismatch"); setGstinMsg(data.error || "GSTIN verification failed"); return; }
      if (res.status === 404) { setGstinStatus("api_error"); setGstinMsg(data.error || "GSTIN not found in GST records"); return; }
      if (!res.ok) { setGstinStatus("api_error"); setGstinMsg(data.error || "GST portal unreachable — try again"); return; }
      const portalName: string = data.legalName || data.tradeName || "";
      if (!portalName) { setGstinStatus("api_error"); setGstinMsg("Could not retrieve company name"); return; }
      if (namesMatch(portalName, companyName)) { setGstinStatus("verified"); setGstinMsg(`Verified: ${portalName}`); }
      else { setGstinStatus("mismatch"); setGstinMsg(`Mismatch — portal shows: "${portalName}"`); }
    } catch { setGstinStatus("api_error"); setGstinMsg("Verification request failed"); setGstinCaptchaD(null); }
  }

  // CIN — structural validation only (MCA has no public API)
  async function verifyCinDashboard() {
    const cin = companyFormik.values.CIN.trim().toUpperCase();
    if (!CIN_REGEX.test(cin)) { toast.error("Enter a valid CIN first."); return; }
    setCinStatus("loading"); setCinMsg("");
    try {
      const res = await fetch(`/api/verify-cin?cin=${cin}`);
      const data = await res.json();
      if (res.status === 400) { setCinStatus("mismatch"); setCinMsg(data.error || "CIN verification failed"); return; }
      setCinStatus("verified"); setCinMsg(data.message || "CIN structure verified (state code & year valid)");
    } catch { setCinStatus("api_error"); setCinMsg("Verification request failed"); }
  }

  // Reset primary brands when category changes
  useEffect(() => {
    skillsFormik.setFieldValue("primarySkill.brands", []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsFormik.values.primarySkill.categoryId]);

  // Hydrate skills formik when geek data / brands / categories load
  useEffect(() => {
    if (!geek || brands.length === 0 || categories.length === 0) return;
    const primaryCategoryId = geek.primarySkill?._id;
    const primaryBrands = brands.filter(
      b => b.category?._id === primaryCategoryId && geek.brandsServiced?.some(gb => gb._id === b._id)
    );
    const secondarySkills: SkillWithBrands[] = geek.secondarySkills?.map(cat => ({
      categoryId: cat._id,
      brands: brands.filter(b => b.category?._id === cat._id && geek.brandsServiced?.some(gb => gb._id === b._id)),
    })) || [];
    skillsFormik.setValues({
      primarySkill: { categoryId: primaryCategoryId, brands: primaryBrands },
      secondarySkills,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geek, brands, categories]);

  // ── Side effects ──────────────────────────────────────────────────────────────
  const handleEmailVerify = () => {
    setIsMailSent(true);
    dispatch(sendVerificationMail(geek?._id || ""));
  };

  useEffect(() => {
    if (geekState?.isMailSent === true && geekState?.isSuccess) {
      setIsMailSent(true);
      toast.dismiss();
      toast.success("Verification mail sent", {
        id: "mailSent", position: "top-center", style: { background: "#333", color: "#fff" },
      });
    } else {
      setIsMailSent(false);
    }
  }, [geekState?.isMailSent, geekState?.isSuccess]);

  useEffect(() => {
    if (geekState?.isProfileUpdated === true && geekState?.isSuccess) {
      if (updatingProfile === false) {
        setOpenProfile(false);
        toast.dismiss();
        toast.success("Profile updated");
        window.location.reload();
      }
      if (updatingSkills === false) {
        setOpenSkills(false);
        toast.dismiss();
        toast.success("Skills updated");
        window.location.reload();
      }
    }
  }, [geekState?.isProfileUpdated, geekState?.isSuccess, updatingProfile, updatingSkills]);

  useEffect(() => {
    if (geek?._id && geek?.idProof?.isAdhaarVerified === false && geek?.idProof?.status === "Requested") {
      dispatch(verificationStatus(geek?.idProof?.requestId));
    }
  }, [geek?.idProof?.isAdhaarVerified, geek?.idProof?.status, geek?.idProof?.requestId, dispatch, geek?._id]);

  const handleDeleteRateCard = async (rateId: string) => {
    await dispatch(deleteRateCard({ id: geek._id, rateCardId: rateId })).unwrap();
  };

  useEffect(() => {
    if (geekState?.isRateCardDeleted === true && geekState?.isSuccess) {
      toast.dismiss();
      toast.success("Rate card deleted");
      window.location.reload();
    }
  }, [geekState?.isRateCardDeleted, geekState?.isSuccess]);

  const azureLoader = ({ src }: { src: string }) => src;

  // ── Display helpers ───────────────────────────────────────────────────────────
  const getSecondarySkillsWithBrands = (secondarySkills: Category[] = [], brandsServiced: Brand[] = []) =>
    secondarySkills.map(skill => ({
      category: skill,
      brands: brandsServiced.filter(b => b.category?._id === skill._id),
    }));

  const getPrimarySkillBrands = (primarySkill: Category, brandsServiced: Brand[] = []) =>
    brandsServiced.filter(b => b.category?._id === primarySkill._id);

  const isLoading = geekState?.isLoading;
  const modeLabels = ["Online", "Offline", "Carry In"];
  const isModeActive = (mode: string) => geek?.modeOfService === "All" || geek?.modeOfService === mode;

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}>{children}</div>
  );

  const SectionTitle = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{children}</h2>
      {action}
    </div>
  );



  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      {isLoading ? (
        <div className="max-w-5xl mx-auto">
          <GlobalSkeleton cards={4} cols={4} lgCols={4} />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto flex flex-col gap-5">

          {/* Profile Header */}
          <Card className="p-0 overflow-hidden">
            <div className={`h-2 w-full ${isCorporate ? "bg-indigo-500" : "bg-teal-500 "}`} />
            <div className="p-5 flex flex-col sm:flex-row gap-4">
              <ProfileImage
                imageUrl={geek?.profileImage?.url}
                azureLoader={azureLoader}
                setOpenImageUpload={setOpenImageUpload}
                contained
              />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                 <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {isCorporate && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H3m8-10h.01M12 17h.01M9 17h.01" />
                    </svg>
                    Corporate
                  </span>
                )}
                {/* {planLabel !== 'Startup' && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${planColorClass}`}>
                    {planLabel}
                  </span>
                )} */}
                {/* {isVerified && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    ID Verified
                  </span>
                )} */}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {geek?.fullName?.first} {geek?.fullName?.last}
              </h1>

              {isCorporate && geek?.companyName && (
                <p className="text-base font-medium text-indigo-600 mt-0.5 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H3m8-10h.01M12 17h.01M9 17h.01" />
                  </svg>
                  {geek.companyName}
                </p>
              )}

              <p className="text-gray-500 mt-1">{geek?.primarySkill?.title}</p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {geek?.address?.city && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {geek.address.city}, {geek.address.state}
                  </span>
                )}
                {geek?.yoe != null && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {geek.yoe} yr{geek.yoe !== 1 ? 's' : ''} experience
                  </span>
                )}
                {geek?.modeOfService && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {geek.modeOfService}
                  </span>
                )}
                {isCorporate && geek?.teamSize && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Team of {geek.teamSize}
                  </span>
                )}
              </div>
            </div>
                <button
                  onClick={() => setOpenProfile(true)}
                  className={`self-start flex items-center gap-1.5 text-sm ${isCorporate ? "text-indigo-600" : "text-teal-600"} hover:text-${isCorporate ? "indigo" : "teal"}-700 border border-${isCorporate ? "indigo" : "teal"}-200 hover:bg-${isCorporate ? "indigo" : "teal"}-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer`}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          </Card>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left — Skills + Rate Cards */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Skills */}
              <Card>
                <SectionTitle action={
                  <button onClick={() => setOpenSkills(true)} className={`text-xs ${isCorporate ? "text-indigo-600" : "text-teal-600"} hover:underline cursor-pointer flex items-center gap-1`}>
                    <Pencil className="w-3 h-3" /> Edit Skills
                  </button>
                }>
                  Skills
                </SectionTitle>

                {geek?.primarySkill ? (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-medium mb-1.5">Primary</p>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-800 mb-2">{geek.primarySkill.title}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {getPrimarySkillBrands(geek.primarySkill, geek.brandsServiced).map(brand => (
                          <span key={brand._id} className={`text-xs ${isCorporate ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-teal-50 text-teal-700 border border-teal-100"} px-2 py-0.5 rounded`}>
                            {brand.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-3">No primary skill added</p>
                )}

                {getSecondarySkillsWithBrands(geek?.secondarySkills, geek?.brandsServiced).length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1.5">Secondary</p>
                    <div className="flex flex-col gap-2">
                      {getSecondarySkillsWithBrands(geek.secondarySkills, geek.brandsServiced).map(({ category, brands: skillBrands }) => (
                        <div key={category._id} className="border border-gray-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">{category.title}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {skillBrands.length > 0 ? skillBrands.map(brand => (
                              <span key={brand._id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {brand.name}
                              </span>
                            )) : <span className="text-xs text-gray-400">No brands</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Rate Cards */}
              <Card>
                <SectionTitle action={
                  <button onClick={() => setOpenRateCard(true)} className={`text-xs ${isCorporate ? "text-indigo-600" : "text-teal-600"} hover:underline cursor-pointer flex items-center gap-1`}>
                    {geek?.rateCard?.length > 0 ? <><Pencil className="w-3 h-3" /> Edit</> : <><Plus className="w-3 h-3" /> Add</>}
                  </button>
                }>
                  Rate Cards
                </SectionTitle>

                {geek?.rateCard?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {geek.rateCard.map(card => (
                      <div key={card._id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between group">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{card.skill?.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{card.chargeType}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800">₹{card.rate}</span>
                          <button onClick={() => handleDeleteRateCard(card._id)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <CreditCard className="w-7 h-7 mb-2 opacity-30" />
                    <p className="text-sm">No rate cards yet</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-5">
              <Card>
                <SectionTitle>Service Mode</SectionTitle>
                <div className="flex flex-col gap-1.5">
                  {modeLabels.map(mode => (
                    <div key={mode} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border ${
                      isModeActive(mode)
                        ? `${isCorporate ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-teal-200 bg-teal-50 text-teal-700"} font-medium`
                        : `${isCorporate ? "border-indigo-100 bg-indigo-50 text-indigo-400" : "border-gray-100 bg-gray-50 text-gray-400"}`
                    }`}>
                      {mode}
                      {isModeActive(mode) && <BadgeCheck className={`w-3.5 h-3.5 ${isCorporate ? "text-indigo-600" : "text-teal-600"}`} />}
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionTitle action={
                  <button onClick={() => setOpenAddressForm(true)} className={`text-xs ${isCorporate ? "text-indigo-600" : "text-teal-600"} hover:underline cursor-pointer flex items-center gap-1`}>
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                }>
                  Address
                </SectionTitle>
                {geek?.address?.city ? (
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <address className="not-italic text-sm text-gray-600 leading-relaxed">
                      {[geek.address.line1, geek.address.line2, geek.address.city, geek.address.state, geek.address.pin]
                        .filter(Boolean).join(", ")}
                    </address>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No address added</p>
                )}
              </Card>

              {isCorporate && (
                <Card>
                  <SectionTitle action={
                    <button onClick={() => setOpenCompanyDetails(true)} className="text-xs text-indigo-600 hover:underline cursor-pointer flex items-center gap-1">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  }>
                    Company Credentials
                  </SectionTitle>
                  <div className="flex flex-col gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">GSTIN</p>
                      {geek?.GSTIN ? (
                        <p className="font-mono text-xs text-gray-700 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                          {geek.GSTIN.slice(0, 2)}{"·".repeat(9)}{geek.GSTIN.slice(-4)}
                          <span className="text-green-500 text-xs">✓</span>
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Not added</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">CIN</p>
                      {geek?.CIN ? (
                        <p className="font-mono text-xs text-gray-700 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                          {geek.CIN.slice(0, 3)}{"·".repeat(12)}{geek.CIN.slice(-6)}
                          <span className="text-green-500 text-xs">✓</span>
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Not added</p>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {geek?.languagePreferences?.length > 0 && (
                <Card>
                  <SectionTitle>Languages</SectionTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {geek.languagePreferences.map((lang: string) => (
                      <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                        {lang}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Subscription */}
              <Card>
                <SectionTitle>Subscription</SectionTitle>
                {(() => {
                  const plan = geek?.subscriptionPlan || "Startup";
                  const colorClass =
                    plan === "Professional"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : plan === "Advance"
                      ? "bg-teal-50 border-teal-200 text-teal-700"
                      : "bg-gray-50 border-gray-200 text-gray-500";
                  return (
                    <div className="flex flex-col gap-3">
                      <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium ${colorClass}`}>
                        <span>{plan}</span>
                        <span className="text-xs font-normal">{plan === "Startup" ? "Free" : "Active"}</span>
                      </div>
                      <Link
                        href="/geeks/subscription"
                        className={`text-xs text-center py-1.5 px-3 rounded-lg border transition ${
                          isCorporate
                            ? "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                            : "border-teal-200 text-teal-600 hover:bg-teal-50"
                        }`}
                      >
                        {plan === "Startup" ? "Upgrade Plan" : "Manage Subscription"}
                      </Link>
                    </div>
                  );
                })()}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}

      {/* Address */}
      <Modal open={openAddressForm} onClose={() => setOpenAddressForm(false)} title="Edit Address" subtitle="Update your service location">
        <AddressForm />
      </Modal>

      {/* Aadhaar */}
      <Modal open={openAdhaarForm} onClose={() => setOpenAdhaarForm(false)} title="Verify Aadhaar" maxWidth="max-w-md">
        <AadhaarVerificationForm status={geek?.idProof?.status} />
      </Modal>

      {/* Image upload */}
      <Modal open={openImageUpload} onClose={() => setOpenImageUpload(false)} title="Update Photo" maxWidth="max-w-sm">
        <ProfileImageUpload imageUrl={geek?.profileImage?.url} geekId={geek?._id} />
      </Modal>

      {/* Rate card */}
      {geek && (
        <Modal open={openRateCard} onClose={() => setOpenRateCard(false)} title="Rate Cards" subtitle="Set your pricing per skill">
          <RateCardSection geek={geek} />
        </Modal>
      )}

      {/* ── Edit Profile modal (personal info only) ── */}
      <Modal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        title="Edit Profile"
        subtitle="Name, contact details, experience and service mode"
      >
        <form onSubmit={profileFormik.handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput readOnly={false} disabled={false} title="First Name" labelFor="firstName"
                value={profileFormik.values.firstName} name="firstName" required
                onChange={profileFormik.handleChange} placeholder="First name" type="text" labelBg="bg-white" />
              {profileFormik.touched.firstName && profileFormik.errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{profileFormik.errors.firstName}</p>
              )}
            </div>
            <div>
              <CustomInput readOnly={false} disabled={false} title="Last Name" labelFor="lastName"
                value={profileFormik.values.lastName} name="lastName" required
                onChange={profileFormik.handleChange} placeholder="Last name" type="text" labelBg="bg-white" />
              {profileFormik.touched.lastName && profileFormik.errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{profileFormik.errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput readOnly={false} disabled={false} title="Email" labelFor="email"
                value={profileFormik.values.email} name="email" required
                onChange={profileFormik.handleChange} placeholder="" type="email" labelBg="bg-white" />
              {profileFormik.touched.email && profileFormik.errors.email && (
                <p className="text-xs text-red-500 mt-1">{profileFormik.errors.email}</p>
              )}
            </div>
            <div>
              <CustomInput title="Mobile" labelFor="mobile" value={profileFormik.values.mobile}
                name="mobile" required onChange={profileFormik.handleChange}
                placeholder="" type="text" readOnly disabled labelBg="bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput readOnly={false} disabled={false} title="Experience (Years)" labelFor="yoe"
                value={profileFormik.values?.yoe} name="yoe" required
                onChange={profileFormik.handleChange} placeholder="" type="number" labelBg="bg-white" />
              {profileFormik.touched.yoe && profileFormik.errors.yoe && (
                <p className="text-xs text-red-500 mt-1">{profileFormik.errors.yoe}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Mode of Service</label>
              <select id="modeOfService" name="modeOfService" value={profileFormik.values.modeOfService}
                onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                className="w-full bg-white border text-gray-600 text-sm border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:border-teal-400"
              >
                <option value="">Select mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Carry In">Carry In</option>
                <option value="All">All</option>
                <option value="None">None</option>
              </select>
              {profileFormik.touched.modeOfService && profileFormik.errors.modeOfService && (
                <p className="text-xs text-red-500 mt-1">{profileFormik.errors.modeOfService}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Language Preferences</label>
            <Multiselect data={Languages} value={profileFormik.values.languagePreferences}
              onChange={value => profileFormik.setFieldValue("languagePreferences", value)}
              placeholder="Select languages" />
            {profileFormik.touched.languagePreferences && profileFormik.errors.languagePreferences && (
              <p className="text-xs text-red-500 mt-1">{profileFormik.errors.languagePreferences}</p>
            )}
          </div>

          <button disabled={updatingProfile} type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {updatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Modal>

      {/* ── Company Details modal (GSTIN + CIN) ── */}
      {isCorporate && (
        <Modal
          open={openCompanyDetails}
          onClose={() => setOpenCompanyDetails(false)}
          title="Company Credentials"
          subtitle="GSTIN and CIN — verify against your company name"
          maxWidth="max-w-lg"
        >
          <form onSubmit={companyFormik.handleSubmit} className="px-5 py-5 flex flex-col gap-5">
            <p className="text-xs text-gray-500 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
              Company name on file: <span className="font-semibold text-indigo-700">{geek?.companyName}</span>
            </p>

            {/* GSTIN */}
            <div>
              <label className="text-sm text-gray-600 block mb-1.5">
                GSTIN <span className="text-xs text-gray-400">(GST Identification Number)</span>
              </label>
              <div className="flex gap-2">
                <input
                  name="GSTIN"
                  value={companyFormik.values.GSTIN}
                  onChange={e => companyFormik.setFieldValue("GSTIN", e.target.value.toUpperCase())}
                  onBlur={companyFormik.handleBlur}
                  placeholder="27AABCU9603R1ZX"
                  maxLength={15}
                  className="flex-1 px-3 py-2 text-sm font-mono tracking-wider bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={gstinCaptchaD ? verifyGstinDashboard : fetchGstinCaptchaD}
                  disabled={gstinStatus === "loading" || !GSTIN_REGEX.test(companyFormik.values.GSTIN)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-indigo-500 text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                >
                  {gstinStatus === "loading" ? "…" : gstinCaptchaD ? "Verify" : "Get Captcha"}
                </button>
              </div>

              {/* Captcha UI — step 2 */}
              {gstinCaptchaD && gstinStatus !== "verified" && gstinStatus !== "mismatch" && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img src={gstinCaptchaD.image} alt="GST captcha" className="h-10 rounded border border-gray-200" />
                    <button type="button" onClick={fetchGstinCaptchaD} className="text-xs text-indigo-600 hover:underline">↻ Refresh</button>
                  </div>
                  <input
                    value={gstinCaptchaInputD}
                    onChange={e => setGstinCaptchaInputD(e.target.value)}
                    placeholder="Enter captcha text shown above"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}

              {companyFormik.touched.GSTIN && companyFormik.errors.GSTIN && (
                <p className="mt-1 text-xs text-red-500">{companyFormik.errors.GSTIN}</p>
              )}
              <VerifyBadge status={gstinStatus} message={gstinMsg} />
            </div>

            {/* CIN */}
            <div>
              <label className="text-sm text-gray-600 block mb-1.5">
                CIN <span className="text-xs text-gray-400">(Corporate Identification Number)</span>
              </label>
              <div className="flex gap-2">
                <input
                  name="CIN"
                  value={companyFormik.values.CIN}
                  onChange={e => companyFormik.setFieldValue("CIN", e.target.value.toUpperCase())}
                  onBlur={companyFormik.handleBlur}
                  placeholder="L17110MH1973PLC019786"
                  maxLength={21}
                  className="flex-1 px-3 py-2 text-sm font-mono tracking-wider bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={verifyCinDashboard}
                  disabled={cinStatus === "loading" || !CIN_REGEX.test(companyFormik.values.CIN)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-indigo-500 text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                >
                  {cinStatus === "loading" ? "…" : "Verify"}
                </button>
              </div>
              {companyFormik.touched.CIN && companyFormik.errors.CIN && (
                <p className="mt-1 text-xs text-red-500">{companyFormik.errors.CIN}</p>
              )}
              <VerifyBadge status={cinStatus} message={cinMsg} />
            </div>

            <button
              type="submit"
              disabled={updatingCompany || gstinStatus === "mismatch" || cinStatus === "mismatch"}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {updatingCompany ? "Saving…" : "Save Credentials"}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Edit Skills modal ── */}
      <Modal
        open={openSkills}
        onClose={() => { setOpenSkills(false); setIsSecondaryOpen(false); setTempSkill({ categoryId: "", brands: [] }); }}
        title="Edit Skills"
        subtitle="Primary skill, secondary skills and brands serviced"
      >
        <form onSubmit={skillsFormik.handleSubmit} className="px-5 py-5 flex flex-col gap-6">

          {/* Primary skill */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Primary Skill</p>
              <span className="text-xs text-gray-400">Your main area of expertise</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Skill category</label>
                <select
                  value={skillsFormik.values.primarySkill?.categoryId}
                  onChange={e => skillsFormik.setFieldValue("primarySkill", { categoryId: e.target.value, brands: [] })}
                  className="w-full bg-white border text-gray-700 text-sm border-gray-300 px-3 py-2 rounded-lg outline-none focus:border-teal-400"
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                {skillsFormik.touched.primarySkill?.categoryId && skillsFormik.errors.primarySkill?.categoryId && (
                  <p className="text-xs text-red-500 mt-1">{skillsFormik.errors.primarySkill.categoryId}</p>
                )}
              </div>
              {skillsFormik.values.primarySkill?.categoryId && (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Brands you service</label>
                  <Multiselect
                    data={getBrandsByCategoryId(brands, skillsFormik.values.primarySkill?.categoryId)}
                    dataKey="_id" textField="name"
                    value={skillsFormik.values.primarySkill?.brands}
                    onChange={value => skillsFormik.setFieldValue("primarySkill.brands", value)}
                    placeholder="Select brands..."
                  />
                  {skillsFormik.touched.primarySkill?.brands && skillsFormik.errors.primarySkill?.brands && (
                    <p className="text-xs text-red-500 mt-1">{skillsFormik.errors.primarySkill.brands as string}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Secondary skills */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Secondary Skills</p>
              <span className="text-xs text-gray-400">Optional additional skills</span>
            </div>

            {/* Existing secondary skills */}
            {skillsFormik.values.secondarySkills.length > 0 && (
              <div className="flex flex-col gap-2">
                {skillsFormik.values.secondarySkills.map((skill, index) => {
                  const category = getCategoryById(categories, skill.categoryId);
                  return (
                    <div key={skill.categoryId} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">{category?.title}</p>
                        <button type="button"
                          onClick={() => skillsFormik.setFieldValue(
                            "secondarySkills",
                            skillsFormik.values.secondarySkills.filter(s => s.categoryId !== skill.categoryId)
                          )}
                          className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <label className="text-xs text-gray-500">Brands you service</label>
                      <Multiselect
                        data={getBrandsByCategoryId(brands, skill.categoryId)}
                        dataKey="_id" textField="name"
                        value={skill.brands}
                        onChange={value => skillsFormik.setFieldValue(`secondarySkills.${index}.brands`, value)}
                        placeholder="Select brands..."
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add new secondary skill */}
            {isSecondaryOpen ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col gap-3 bg-gray-50">
                <p className="text-xs font-medium text-gray-500">New secondary skill</p>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Skill category</label>
                  <select
                    value={tempSkill.categoryId}
                    onChange={e => setTempSkill({ categoryId: e.target.value, brands: [] })}
                    className="w-full bg-white border text-gray-700 text-sm border-gray-300 px-3 py-2 rounded-lg outline-none"
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter(c => c._id !== skillsFormik.values.primarySkill.categoryId)
                      .map(c => (
                        <option key={c._id} value={c._id}
                          disabled={isSecondaryCategoryAdded(skillsFormik.values.secondarySkills, c._id)}
                        >
                          {c.title}
                        </option>
                      ))}
                  </select>
                </div>
                {tempSkill.categoryId && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Brands you service</label>
                    <Multiselect
                      data={getBrandsByCategoryId(brands, tempSkill.categoryId)}
                      dataKey="_id" textField="name"
                      value={tempSkill.brands}
                      onChange={value => setTempSkill(prev => ({ ...prev, brands: value }))}
                      placeholder="Select brands..."
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button"
                    disabled={!tempSkill.categoryId || tempSkill.brands.length === 0}
                    onClick={() => {
                      skillsFormik.setFieldValue("secondarySkills", [...skillsFormik.values.secondarySkills, tempSkill]);
                      setTempSkill({ categoryId: "", brands: [] });
                      setIsSecondaryOpen(false);
                    }}
                    className="bg-teal-600 text-white text-sm px-4 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                  <button type="button"
                    onClick={() => { setIsSecondaryOpen(false); setTempSkill({ categoryId: "", brands: [] }); }}
                    className="border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button type="button"
                disabled={!skillsFormik.values.primarySkill.categoryId}
                onClick={() => setIsSecondaryOpen(true)}
                className="flex items-center gap-1.5 text-sm text-teal-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:text-teal-700 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add secondary skill
              </button>
            )}
          </div>

          <button disabled={updatingSkills} type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {updatingSkills ? "Saving..." : "Save Skills"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
