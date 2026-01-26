import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import React from "react";

const CustomModel: React.FC<{
  title: string  | React.ReactNode | Element;
  description: string;
  isOpen: boolean;
  toggleModal: () => void;
  text: string;
  openModal: boolean
  onOk: () => void;
  onCancel: () => void
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  title,
  text,
  description,
  // toggleModal,
  // openModal,
  onOk,
  onCancel
}) => {
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-none w-full font-semibold z-99 flex justify-start shadow-none text-sm cursor-pointer h-fit p-0 bg-transparent px-0 py-0">{text}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{React.isValidElement(title) ? title : String(title)}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} >Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onOk}>Yes, I&apos;m Sure</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default CustomModel