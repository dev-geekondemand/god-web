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
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'




const DialogComponent = ({
   openBtnText,
   showDialog,
   seekerId,
   setShowDialog,
   title,modes,
   titleDesc,
   selectedMode,
   setSelectedMode,
   onSubmit,
   isSeekerAddress
  }: {
    openBtnText: string,
     seekerId: string,
     showDialog: boolean,
     setShowDialog: React.Dispatch<React.SetStateAction<boolean>>,
     title: string,
      titleDesc: string,
      selectedMode: string,
     modes: string[] ,
      setSelectedMode: React.Dispatch<React.SetStateAction<string>>,
      onSubmit: () => void
      isSeekerAddress: boolean
    }) => {

    const [open, setOpen] = useState(false)
    const toggleDropdown = () => setOpen(!open)

    const handleModeSelect = (mode: string) => {
        setSelectedMode(mode)
        setOpen(false)
    }

    const handleClose = () => {
        setShowDialog(false)
    }

  return (
    <section className='w-full h-full relative'>
      
      <Dialog open={showDialog} onOpenChange={handleClose}>
      <form>
        <DialogTrigger asChild>
          <Button className='bg-black text-white hover:bg-black/80 hover:text-white' variant="outline">{openBtnText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {titleDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <div className="relative w-full mx-auto">
                {/* Custom Select Button */}
                <div
                    onClick={toggleDropdown}
                    className="bg-white border text-sm text-gray-700 border-gray-300 rounded-md px-4 py-2 cursor-pointer"
                >
                    {selectedMode || 'Select Mode'} 
                </div>

                {/* Dropdown Options (Always open upwards) */}
                <div
                    className={`absolute z-50 left-0 custom-scrollbar right-0 bg-white border border-b-0 border-gray-800 rounded-sm -scroll-m-8 mt-1 max-h-48 overflow-y-scroll ${open ? 'block' : 'hidden'} bottom-full`}
                >
                    {modes?.map((mode) => (
                    <div
                        key={mode}
                        onClick={()=>handleModeSelect(mode)}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-500"
                    >
                        {mode}
                    </div>
                    ))}
                </div>
                </div>
            </div>
            <div className="grid gap-3">
              {selectedMode && selectedMode === "Offline" && !isSeekerAddress && (
                <div className='flex flex-col gap-1'>
                  <p className='text-xs text-black'>You have not added an address for offline services. <Link onClick={handleClose} href={`/seeker/${seekerId}/add-address`} className='text-xs text-teal-600 cursor-pointer'>Add Now</Link></p>
                </div>
                
              )} 
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onSubmit={()=>{handleClose();onSubmit()}} type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    </section>
  )
}

export default DialogComponent
