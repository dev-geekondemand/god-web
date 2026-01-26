"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { updateProfileImage } from "@/features/geek/geekSlice";
// import { updateProfilePicture } from "@/features/geek/geekSlice";

interface Props {
  imageUrl: string;
  geekId: string;
}

const ProfileImageUpload: React.FC<Props> = ({ imageUrl, geekId }) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        dispatch(updateProfileImage({id: geekId, formData: formData}));
    } catch (err) {
      console.log(err);
    }
  };
  
const azureLoader = ({ src }:{src:string}) => src;

  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden group shadow-md border border-gray-200">
      <Image
        loader={azureLoader}
        src={ imageUrl ? imageUrl : "/assets/images/placeholder_user.jpg"}
        alt="Profile Picture"
        width={160}
        height={160}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
      >
        Change Photo
      </div>
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
