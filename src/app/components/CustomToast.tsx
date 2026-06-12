import Image from "next/image";
import React from "react";
import { toast, Toast } from "react-hot-toast";

export type ToastType = "success" | "error" | "warning" | "info" | "default";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface CustomToastProps {
  t: Toast;
  title: string;
  message: string;
  avatar?: string;
  type?: ToastType;
}

const typeConfig: Record<
  ToastType,
  { borderColor: string; bgColor: string; icon: React.ReactNode }
> = {
  success: {
    borderColor: "border-l-green-500",
    bgColor: "bg-green-50",
    icon: (
      <svg
        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  error: {
    borderColor: "border-l-red-500",
    bgColor: "bg-red-50",
    icon: (
      <svg
        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    borderColor: "border-l-yellow-500",
    bgColor: "bg-yellow-50",
    icon: (
      <svg
        className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  info: {
    borderColor: "border-l-blue-500",
    bgColor: "bg-blue-50",
    icon: (
      <svg
        className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  default: {
    borderColor: "border-l-gray-400",
    bgColor: "bg-white",
    icon: null,
  },
};

const CustomToast: React.FC<CustomToastProps> = ({
  t,
  title,
  message,
  avatar,
  type = "default",
}) => {
  const { borderColor, bgColor, icon } = typeConfig[type];

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden border-l-4 ${borderColor}`}
    >
      <div className={`${bgColor} p-4`}>
        <div className="flex items-start gap-3">
          {avatar ? (
            <Image
              className="h-9 w-9 rounded-full object-contain flex-shrink-0"
              src={avatar}
              alt="avatar"
              width={36}
              height={36}
            />
          ) : (
            icon
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {title}
            </p>
            <p className="mt-0.5 text-sm text-gray-500 leading-snug">
              {message}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const showCustomToast = (
  props: Omit<CustomToastProps, "t">,
  options?: { position?: ToastPosition; duration?: number }
) => {
  toast.dismiss();
  toast.custom((t) => <CustomToast t={t} {...props} />, options);
};

export default CustomToast;
