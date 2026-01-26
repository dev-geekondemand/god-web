import React from 'react'

interface CustomInputProps {
  value: string | number;
  name:string;
  labelFor:string;
  title:string;
  required:boolean;
  placeholder:string,
  disabled:boolean,
  readOnly:boolean
  type:"text" | "number" | "email" | "password";
  labelBg:string;
  onChange:(event: React.ChangeEvent<HTMLInputElement>) => void

}

const CustomInput = ({name,placeholder,onChange,value, labelFor,title,required,type,labelBg,disabled,readOnly}:CustomInputProps) => {
  return (
        <div className="relative  w-full dark:bg-gray-950">
                <input 
                type={type}
                onChange={onChange}
                value={value}
                required={required}
                id={name}
                name={name}
                disabled={disabled}
                readOnly={readOnly}
                className="block md:px-2.5 px-2 md:pb-2.5 pb-1.5 md:pt-4 pt-2 w-full text-sm text-gray-950 outline-none dark:text-white border bg-transparent  rounded-lg  border-gray-300 appearance-none  peer" placeholder={placeholder}
                >
                </input>
                <label htmlFor={labelFor} className={`absolute text-sm text-gray-500 dark:text-gray-100 duration-300 transform -translate-y-4 scale-75 top-2 z-1 origin-[0] dark:bg-gray-950 ${labelBg ? labelBg : "bg-gray-200"}  px-2 peer-focus:px-2 peer-focus:${labelBg ? labelBg : "bg-gray-200"} dark:peer-focus:bg-black peer-focus:text-black dark:peer-focus:text-white font-normal peer-focus:font-semibold  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-4`}>{title}</label>

            </div>
          
  )
}

export default CustomInput
