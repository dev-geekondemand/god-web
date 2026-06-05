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

  const handleClick = (category: Category) => () => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 text-sm text-gray-700 rounded-md px-4 py-2 cursor-pointer"
      >
        {selectedCategory?.title || 'Select Skill'}
      </div>

      {isOpen && (
        <div className="absolute z-20 left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto custom-scrollbar shadow-sm">
          {categories?.map((cat, index) => (
            <div
              key={index}
              onClick={handleClick(cat)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-500 hover:text-white"
            >
              {cat?.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
