"use client"
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface UISelectProps {
  options: Option[]
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function UISelect({ options, label, placeholder, value, onChange }: UISelectProps) {
  return (
    <Select  value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-gray-600  ">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem  key={option.value}  disabled={option.disabled} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
