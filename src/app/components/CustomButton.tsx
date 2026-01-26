"use client"
import React from 'react'

interface CustomButtonProps {
    text: string;
    type: "button" | "submit" | "reset";
    width:string;
    handleClick: (e: React.MouseEvent) => void;
  }

const CustomButton = ({ text, type,width,handleClick }: CustomButtonProps) => {
  return (
    <div className={`group ${width} relative inline-block text-nowrap`}> {/* group container for hover state */}
    <button
        className="relative cursor-pointer w-full px-4 py-2 text-white bg-teal-700 transform rounded-sm overflow-hidden focus:outline-none"
        type={type}
        onClick={handleClick}
    >
        <span className="relative z-40">{text}</span>
    </button>
    
    <div className="absolute left-0 bottom-0 w-full h-full rounded-md bg-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  )
}

export default CustomButton
