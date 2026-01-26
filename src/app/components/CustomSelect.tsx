"use client"
import {Category} from '@/interfaces/Category';
import React, { useState } from 'react';

interface CustomSelectProps {
  categories: Category[];
  selectedCategory: Category | null;
  onChange: (category: Category) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ categories, selectedCategory, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (category: Category) => () => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Custom Select Button */}
      <div
        onClick={toggleDropdown}
        className="bg-white border text-sm text-gray-700 border-gray-300 rounded-md px-4 py-2 cursor-pointer"
      >
        {selectedCategory?.title || 'Select Skill'}
      </div>

      {/* Dropdown Options (Always open upwards) */}
      <div
        className={`absolute z-50 left-0 custom-scrollbar right-0 bg-white border border-b-0 border-gray-800 rounded-sm -scroll-m-8 mt-1 max-h-48 overflow-y-scroll ${isOpen ? 'block' : 'hidden'} bottom-full`}
      >
        {categories?.map((cat, index) => (
          <div
            key={index}
            onClick={handleClick(cat)}
            className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-500"
          >
            {cat?.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
