"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useAppDispatch, } from "@/lib/hooks";
import {
  uploadMediaThunk,
  resetMediaState,
} from "@/features/media/mediaSlice";
import { cancelUpload } from "@/features/media/mediaService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const UploadMediaPage = ({ requestId,isUploadedOpen,setIsUploadedOpen }: { requestId: string,isUploadedOpen: boolean,setIsUploadedOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const dispatch = useAppDispatch();
  const { loading, progress, success, error } = useSelector(
    (state:RootState) => state.media
  );

  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      formData.append("requestId", requestId);

      acceptedFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          formData.append("images", file);
        } else if (file.type.startsWith("video/")) {
          formData.append("video", file);
        }
        setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      });

      try{
        await dispatch(uploadMediaThunk({ requestId, formData })).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }catch(err){
        setPreviews([]);
        
        // toast.error("Failed to upload media");
      }
    },
    [dispatch, requestId]
  );

  const handleCancel = () => {
    cancelUpload();
    dispatch(resetMediaState());
    setPreviews([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-6 rounded-xl bg-white relative">
      <button className="text-gray-900 absolute top-2 right-2 cursor-pointer"><X onClick={() => setIsUploadedOpen(false)} className="w-6 h-6" /></button>
      <h2 className="text-xl font-bold mb-4 text-center text-teal-600">
        Upload Media for Request
      </h2>

      <div
        {...getRootProps()}
        className={`p-8 border-2 min-h-36 border-dashed rounded cursor-pointer transition-all ${
          isDragActive ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500 font-semibold">Drop files here...</p>
        ) : (
          <p className="text-gray-500 text-center">
            Drag & drop images/videos here, or click to browse
          </p>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {previews.map((src, idx) =>
            src.endsWith(".mp4") ? (
              <video
                key={idx}
                src={src}
                controls
                className="w-full h-24 object-cover rounded"
              />
            ) : (
              <Image
                
                key={idx}
                src={src}
                alt="preview"
                width={150}
                height={100}
                className="w-full h-24 object-cover rounded"
              />
            )
          )}
        </div>
      )}

      {loading && (
        <div className="mt-4">
          <p className="text-sm text-blue-500 mb-2">Uploading... {progress}%</p>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button
            onClick={handleCancel}
            className="mt-2 text-red-500 text-sm hover:underline"
          >
            Cancel Upload
          </button>
        </div>
      )}

      {success && (
        <p className="mt-4 text-green-600 text-center font-medium">
          Upload successful!
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
      )}
    </div>
  );
};

export default UploadMediaPage;
