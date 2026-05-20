"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { loadUser, sendVerificationMail, updateProfileImage, updateUserProfile, UserState } from "@/features/seeker/seekerSlice";
import Link from "next/link";
import PageBanner from "@/app/components/PageBanner";
import { Mail, Phone, PlusIcon, MapPin, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import CustomInput from "@/app/components/CustonInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.seeker) as UserState;
  const router = useRouter();

  const { user, isPending } = userState;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const handleImageChange = async (file: File) => {
    if (!file || !user) {
      toast.error("User not found");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPG or PNG allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await dispatch(updateProfileImage({ userId: user._id, image: file })).unwrap();
      toast.success("Profile image updated");
    } catch {
      toast.error("Failed to update profile image");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (userState?.isMailSent) {
      toast.success("Verification email sent.", {
        position: "top-center",
        style: { background: "#333", color: "#fff" },
      });
    }
  }, [userState.isMailSent]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.fullName?.first || "",
      lastName: user?.fullName?.last || "",
      email: user?.email || "",
      phone:
        user?.authProvider !== "custom" && user?.phone?.startsWith("+91")
          ? user.phone.slice(3)
          : user?.phone || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().when([], () =>
        user?.authProvider === "custom"
          ? Yup.string().notRequired()
          : Yup.string()
              .required("Phone number is required")
              .matches(/^\d{10}$/, "Phone number must be 10 digits")
      ),
    }),
    onSubmit: (values) => {
      if (!formik.dirty) {
        toast.error("No changes made.", { position: "top-center" });
        return;
      }
      dispatch(
        updateUserProfile({
          fullName: { first: values.firstName, last: values.lastName },
          email: values.email,
          phone: values.phone,
        })
      );
      setIsEditing(false);
    },
  });

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const address = user?.address || null;

  return (
    <section className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
      <PageBanner title="My Profile" crumbs={[{ label: 'My Profile' }]} />

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-4 py-10 flex flex-col gap-5">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <label htmlFor="profileImage" className="cursor-pointer block">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
                <Image
                 
                  src={imagePreview || user?.profileImage || "/assets/images/placeholder_user.jpg"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 hidden group-hover:flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {uploading ? "Uploading…" : "Change"}
                </span>
              </div>
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageChange(file);
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.fullName?.first} {user?.fullName?.last}
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{user?.email || "Email not available"}</span>
              {user?.isEmailVerified ? (
                <span className="flex items-center gap-0.5 text-green-600 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <button
                  onClick={() => dispatch(sendVerificationMail(user?._id || ""))}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
                >
                  Verify email
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{user?.phone || "Phone not added"}</span>
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0 flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                <p className="text-sm text-gray-500 mt-0.5">Update your personal information below.</p>
              </div>
              <button
                onClick={() => { setIsEditing(false); formik.resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <CustomInput
                    name="firstName"
                    type="text"
                    placeholder=" "
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    labelFor="firstName"
                    title="First Name"
                    required
                    labelBg="bg-white"
                    disabled={false}
                    readOnly={false}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-xs">{formik.errors.firstName}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <CustomInput
                    name="lastName"
                    type="text"
                    placeholder=" "
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    labelFor="lastName"
                    title="Last Name"
                    required
                    labelBg="bg-white"
                    disabled={false}
                    readOnly={false}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-xs">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <CustomInput
                    name="email"
                    type="email"
                    placeholder=" "
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    labelFor="email"
                    title="Email"
                    required
                    labelBg="bg-white"
                    disabled={user?.authProvider !== "custom"}
                    readOnly={user?.authProvider !== "custom"}
                  />
                  {user?.authProvider !== "custom" && (
                    <p className="text-xs text-gray-400">Email cannot be changed for social logins.</p>
                  )}
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs">{formik.errors.email}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <CustomInput
                    name="phone"
                    type="text"
                    placeholder=" "
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    labelFor="phone"
                    title="Phone"
                    required
                    labelBg="bg-white"
                    disabled={user?.authProvider === "custom"}
                    readOnly={user?.authProvider === "custom"}
                  />
                  {user?.authProvider === "custom" && (
                    <p className="text-xs text-gray-400">Phone cannot be changed for email logins.</p>
                  )}
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); formik.resetForm(); }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-500" />
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            </div>
            <Link
              href={`/seeker/${user?._id}/add-address`}
              className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              {address?.city ? "Edit" : "Add Address"}
            </Link>
          </div>

          {address?.city ? (
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 flex flex-col gap-0.5">
              {address.line1 && <p>{address.line1}</p>}
              {address.line2 && <p>{address.line2}</p>}
              <p className="font-medium">
                {address.city}, {address.state} — {address.pin}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No address saved yet.</p>
          )}
        </div>

        {/* Bookings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">My Bookings</h3>
              <p className="text-sm text-gray-500">
                {user?.requests?.length ?? 0} total booking{(user?.requests?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/seeker/${user?._id}/services`)}
            className="flex-shrink-0 flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View All
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default UserProfile;
