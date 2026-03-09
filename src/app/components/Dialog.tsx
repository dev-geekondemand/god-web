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
  }) => {

  const [open, setOpen] = useState(false)
  const azureLoader = ({ src }: { src: string }) => src;

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode)
    setOpen(false)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const canConfirm = !!selectedMode && (selectedMode !== 'Offline' || isSeekerAddress);

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
                        <Image loader={azureLoader} src={skill.image.url} alt={skill.title} fill className="rounded-full object-cover" />
                      </div>
                    )}
                    {skill.title}
                  </div>
                ))}
              </div>
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
