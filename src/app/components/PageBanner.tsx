import Link from "next/link";
import React from "react";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  crumbs: Crumb[];
}

function HomeIcon() {
  return (
    <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M22 22L2 22" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M4 22V9.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 22V9.5" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg fill="currentColor" className="w-2 h-2 text-teal-600 opacity-70" viewBox="0 0 24 24">
      <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
    </svg>
  );
}

export default function PageBanner({ title, crumbs }: PageBannerProps) {
  return (
    <div className="w-full relative breadcrumb-bg-2">
      <div className="w-full breadcrumb-bg relative flex justify-center items-center py-5 text-center ">
        <div className="xl:max-w-6xl w-full h-full lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto">
          <div className="w-full flex flex-col gap-3 items-center justify-center">
            <h2 className="text-4xl font-bold text-black">{title}</h2>
            <div className="flex gap-2 items-center flex-wrap justify-center">
              <Link href="/" className="cursor-pointer">
                <HomeIcon />
              </Link>
              {crumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <ChevronIcon />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-teal-600 hover:text-teal-700 transition"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <p className="text-teal-600">{crumb.label}</p>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
