"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { uploadMediaThunk, resetMediaState } from "@/features/media/mediaSlice";
import { cancelUpload } from "@/features/media/mediaService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { X, CheckCircle2 } from "lucide-react";

const UploadMediaPage = ({
  requestId,
  isUploadedOpen,
  setIsUploadedOpen,
  onSuccess,
}: {
  requestId: string;
  isUploadedOpen: boolean;
  setIsUploadedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { loading, progress, success, error } = useSelector(
    (state: RootState) => state.media
  );

  const [previews, setPreviews] = useState<{ src: string; type: "image" | "video" }[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      formData.append("requestId", requestId);

      const newPreviews: { src: string; type: "image" | "video" }[] = [];
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          formData.append("images", file);
          newPreviews.push({ src: URL.createObjectURL(file), type: "image" });
        } else if (file.type.startsWith("video/")) {
          formData.append("video", file);
          newPreviews.push({ src: URL.createObjectURL(file), type: "video" });
        }
      });
      setPreviews((prev) => [...prev, ...newPreviews]);

      try {
        await dispatch(uploadMediaThunk({ requestId, formData })).unwrap();
        onSuccess?.();
      } catch {
        setPreviews([]);
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
    accept: { "image/*": [], "video/*": [] },
    multiple: true,
  });

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-2xl bg-white relative flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Complete Service</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload proof of work to mark this request complete.</p>
        </div>
        <button
          onClick={() => setIsUploadedOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dropzone */}
      {!success && (
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragActive
              ? "border-teal-400 bg-teal-50"
              : "border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/40"
          }`}
        >
          <input {...getInputProps()} />
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDragActive ? 'bg-teal-100' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <svg className={`w-7 h-7 ${isDragActive ? 'text-teal-500' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-teal-600 font-semibold text-sm">Drop files here</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 text-sm font-medium">
                Drag & drop files here, or{" "}
                <span className="text-teal-600 underline-offset-2 underline">browse</span>
              </p>
              <p className="text-gray-400 text-xs mt-1">Supports images and videos</p>
            </div>
          )}
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && !success && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">{previews.length} file{previews.length !== 1 ? 's' : ''} selected</p>
          <div className="grid grid-cols-4 gap-2">
            {previews.map((item, idx) =>
              item.type === "video" ? (
                <div key={idx} className="relative h-20 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
                  <video src={item.src} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div key={idx} className="relative h-20 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={item.src} alt="preview" fill className="object-cover" sizes="80px" />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Progress */}
      {loading && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Uploading...</span>
            <span className="text-teal-600 font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button onClick={handleCancel} className="text-red-400 hover:text-red-600 text-xs w-fit transition-colors">
            Cancel upload
          </button>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">Upload Successful!</p>
            <p className="text-sm text-gray-400 mt-0.5">Your media has been attached to this request.</p>
          </div>
          <button
            onClick={() => setIsUploadedOpen(false)}
            className="mt-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadMediaPage;
