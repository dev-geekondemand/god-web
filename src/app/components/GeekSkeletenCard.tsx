import React from "react";

const GeekSkeletonCard = () => {
  return (
    <div className="flex flex-col bg-white gap-3 shadow rounded-lg p-4 animate-pulse">
      {/* Image */}
      <div className="w-full h-54 bg-gray-200 rounded-md" />

      {/* Text */}
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default GeekSkeletonCard;
