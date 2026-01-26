import React, { useState } from "react";
import Image from "next/image";

interface ProfileImageProps {
  imageUrl?: string;
  azureLoader: ({ src }: { src: string }) => string;
  setOpenImageUpload: (val: boolean) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  azureLoader,
  setOpenImageUpload,
}) => {
  const [openImageView, setOpenImageView] = useState(false);

  return (
    <>
      {/* Profile Image with Hover Options */}
      <div className="absolute -bottom-8 md:-bottom-16 lg:left-36 left-1/2 transform -translate-x-1/2 bg-white dark:bg-black border-green-500 dark:border-gray-800 border-2  sm:w-32 w-36 h-36 sm:h-32 rounded-full overflow-hidden group shadow-md">
        <Image
          
          loader={azureLoader}
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-full"
          src={imageUrl || "/assets/images/placeholder_user.jpg"}
          alt="Profile"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex flex-col items-center justify-center space-y-1 text-xs sm:text-sm text-white font-medium">
          <button
            onClick={() => setOpenImageView(true)}
            className="hover:underline"
          >
            👁 View
          </button>
          <button
            onClick={() => setOpenImageUpload(true)}
            className="hover:underline"
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* View Image Modal */}
      {openImageView && (
        <div className="fixed p-12 inset-0 w-full bg-gray-100  bg-opacity-90 z-50 flex items-center justify-center px-4">
          <div className="bg-white  rounded-lg p-4 max-w-xl w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-black cursor-pointer text-lg"
              onClick={() => setOpenImageView(false)}
            >
              ✖
            </button>
            <Image
             
              loader={azureLoader}
              width={800}
              height={800}
              src={imageUrl || "/assets/profile.jpg"}
              alt="Full Size"
              className="rounded-lg w-full h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
