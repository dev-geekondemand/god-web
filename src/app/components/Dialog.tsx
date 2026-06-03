"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { Category } from '@/interfaces/Category'
import Image from 'next/image'
import Brand from '@/interfaces/Brand'

type TimeSlot = { from: string; to: string }
type AvailabilitySlotItem = { day: string; timeSlots: TimeSlot[] }
export type SelectedSlot = { day: string; timeSlot: TimeSlot }

const DialogComponent = ({
   showDialog,
   seekerId,
   setShowDialog,
   title,
   modes,
   titleDesc,
   selectedMode,
   setSelectedMode,
   onSubmit,
   isSeekerAddress,
   skills,
   selectedSkill,
   setSelectedSkill,
   isLoading,
   availability,
   selectedSlot,
   setSelectedSlot,
   skillBrands,
   selectedBrand,
   setSelectedBrand,
   preselectedBrandId,
  }: {
    seekerId: string,
    showDialog: boolean,
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    titleDesc: string,
    selectedMode: string,
    modes: string[],
    setSelectedMode: React.Dispatch<React.SetStateAction<string>>,
    onSubmit: () => void,
    isSeekerAddress: boolean,
    skills?: Category[],
    selectedSkill?: Category,
    setSelectedSkill?: React.Dispatch<React.SetStateAction<Category | undefined>>,
    isLoading?: boolean,
    availability?: { slots: AvailabilitySlotItem[] },
    selectedSlot?: SelectedSlot,
    setSelectedSlot?: React.Dispatch<React.SetStateAction<SelectedSlot | undefined>>,
    skillBrands?: Brand[],
    selectedBrand?: Brand,
    setSelectedBrand?: React.Dispatch<React.SetStateAction<Brand | undefined>>,
    preselectedBrandId?: string | null,
  }) => {

  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | undefined>()

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode)
    setOpen(false)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleDaySelect = (day: string) => {
    setSelectedDay(day)
    if (selectedSlot?.day !== day) setSelectedSlot?.(undefined)
  }

  const hasBrands = (skillBrands?.length ?? 0) > 0
  const hasAvailability = (availability?.slots?.length ?? 0) > 0
  const canConfirm = !!selectedMode && (selectedMode !== 'Offline' || isSeekerAddress) && (!hasAvailability || !!selectedSlot) && (!hasBrands || !!selectedBrand);

  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{titleDesc}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-1">

          {skills && skills.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                {skills.map((skill) => (
                  <div
                    key={skill._id}
                    onClick={() => setSelectedSkill?.(skill)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer border transition-colors ${
                      selectedSkill?._id === skill._id
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                  >
                    {skill?.image?.url && (
                      <div className="w-7 h-7 relative flex-shrink-0">
                        <Image src={skill.image.url} alt={skill.title} fill className="rounded-full object-cover" sizes="28px" />
                      </div>
                    )}
                    {skill.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasBrands && !preselectedBrandId && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Brand <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {skillBrands!.map((brand) => (
                  <div
                    key={brand._id}
                    onClick={() => setSelectedBrand?.(brand)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer border transition-colors ${
                      selectedBrand?._id === brand._id
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                  >
                    {brand?.image?.url && (
                      <div className="w-7 h-7 relative flex-shrink-0">
                        <Image src={brand.image.url} alt={brand.name} fill className="rounded-full object-cover" sizes="28px" />
                      </div>
                    )}
                    {brand.name}
                  </div>
                ))}
              </div>
              {!selectedBrand && (
                <p className="text-xs text-amber-600">Please select a brand to continue.</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Mode of Service</label>
            <div className="relative w-full">
              <div
                onClick={() => setOpen(!open)}
                className="bg-white border text-sm text-gray-700 border-gray-300 rounded-md px-4 py-2.5 cursor-pointer flex justify-between items-center"
              >
                <span className={selectedMode ? 'text-gray-800' : 'text-gray-400'}>{selectedMode || 'Select a mode'}</span>
                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="currentColor" />
                </svg>
              </div>
              {open && (
                <div className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-md overflow-hidden">
                  {modes?.map((mode) => (
                    <div
                      key={mode}
                      onClick={() => handleModeSelect(mode)}
                      className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 hover:text-teal-700 ${selectedMode === mode ? 'bg-teal-50 text-teal-700 font-medium' : ''}`}
                    >
                      {mode}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedMode === 'Offline' && !isSeekerAddress && (
            <p className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              No address on file for offline services.{' '}
              <Link onClick={handleClose} href={`/seeker/${seekerId}/add-address`} className="text-teal-600 underline font-medium">
                Add Now
              </Link>
            </p>
          )}

          {hasAvailability && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Preferred Slot <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availability!.slots.map(slot => (
                  <button
                    key={slot.day}
                    type="button"
                    onClick={() => handleDaySelect(slot.day)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                      selectedDay === slot.day
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {slot.day.slice(0, 3)}
                  </button>
                ))}
              </div>
              {selectedDay && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {availability!.slots.find(s => s.day === selectedDay)?.timeSlots.map((ts, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSlot?.({ day: selectedDay, timeSlot: ts })}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        selectedSlot?.day === selectedDay && selectedSlot?.timeSlot.from === ts.from
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 text-gray-600 hover:border-teal-300'
                      }`}
                    >
                      {ts.from} – {ts.to}
                    </button>
                  ))}
                </div>
              )}
              {!selectedSlot && (
                <p className="text-xs text-gray-400">Select a day then a time slot.</p>
              )}
              {selectedSlot && (
                <p className="text-xs text-teal-600 font-medium">
                  {selectedSlot.day}, {selectedSlot.timeSlot.from} – {selectedSlot.timeSlot.to}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            disabled={isLoading || !canConfirm}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogComponent
