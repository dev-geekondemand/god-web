"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { updateProfileImage } from "@/features/geek/geekSlice";
import { Camera } from "lucide-react";

interface Props {
  imageUrl: string;
  geekId: string;
}

const ProfileImageUpload: React.FC<Props> = ({ imageUrl, geekId }) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    try {
      dispatch(updateProfileImage({ id: geekId, formData }));
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="p-6 flex flex-col items-center gap-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900 text-center">Update Profile Photo</h3>
        <p className="text-sm text-gray-500 mt-0.5 text-center">Click the photo to upload a new one</p>
      </div>

      <div
        className="relative w-32 h-32 rounded-full overflow-hidden group cursor-pointer border-2 border-gray-200 shadow-sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
         
          src={preview || imageUrl || "/assets/images/placeholder_user.jpg"}
          alt="Profile Picture"
          width={160}
          height={160}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <Camera className="w-6 h-6 text-white mb-1" />
          <span className="text-white text-xs font-medium">Change</span>
        </div>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        Choose Photo
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;
