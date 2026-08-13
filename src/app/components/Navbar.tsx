"use client";

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CustomButton from './CustomButton';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { logoutUser, UserState } from '@/features/seeker/seekerSlice';
import CustomModel from './CustomModal';
import { GeekInitialState, logoutGeek } from '@/features/geek/geekSlice';
import { Bell, UserRound, ChevronDown, LayoutDashboard, CreditCard, ClipboardList, LogOut, ArrowRight, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from '@/lib/store';
import { useAppDispatch } from '@/lib/hooks';
import { ServiceRequest } from '@/interfaces/ServiceRequest';
import toast from 'react-hot-toast';
import { getSeekerRequests } from '@/features/request/requestSlice';
import CustomToast, { showCustomToast } from './CustomToast';
import { getCategoryPages } from '@/features/categoryPage/categoryPageSlice';
import { CategoryPageData } from '@/utils/categoryPage';

const SERVICES_DROPDOWN_LIMIT = 6;

const NotifBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="text-white text-xs font-medium bg-red-500 px-1.5 py-0.5 rounded-full leading-none">
      {count}
    </span>
  ) : null;

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    setServicesOpen(true);
  };
  const closeServices = () => {
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.seeker) as UserState;
  const geekState = useSelector((state: RootState) => state.geek) as GeekInitialState;
  const isGeekAuthenticated = geekState?.isAuthenticated;
  const geek = geekState?.geek;
  const seekerRequests = useSelector((state: RootState) => state.request.requests) as ServiceRequest[];
  const categoryPages = useSelector((state: RootState) => state.categoryPage?.pages) as CategoryPageData[];

  // Seeker: requests with activity in the last 24 h
  // Pending -> no responseAt yet, use createdAt; Accepted -> use responseAt
  const seekerUnread = seekerRequests.filter((r) => {
    const relevant = r.geekResponseStatus === 'Pending' || r.geekResponseStatus === 'Accepted';
    if (!relevant) return false;
    const ts = r.responseAt ? new Date(r.responseAt).getTime() : new Date(r.createdAt).getTime();
    return Date.now() - ts < 86400000;
  }).length;

  // Geek: count of pending incoming requests
  const geekUnread = Array.isArray(geek?.requests)
    ? (geek.requests as ServiceRequest[]).filter((r) => r.geekResponseStatus === 'Pending').length
    : 0;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getSeekerRequests());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(getCategoryPages());
  }, [dispatch]);

  const publishedCategoryPages = (categoryPages ?? []).filter((page) => page.isPublished);
  const servicesDropdownPages = publishedCategoryPages.slice(0, SERVICES_DROPDOWN_LIMIT);

  const navlinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Services", isDropdown: true as const },
    { id: 3, name: "Geeks", link: "/geeks" },
    { id: 4, name: "About Us", link: "/about" },
    { id: 5, name: "Blogs", link: "/blogs" },
    { id: 6, name: "Contact Us", link: "/contact" },
  ];

  const handleLogout = async () => {
    const userType = localStorage.getItem("userType");
    try {
      if (userType === "seeker") {
        await dispatch(logoutUser()).unwrap();
      } else {
        await dispatch(logoutGeek()).unwrap();
      }
      router.push('/');
    } catch {
      // error toast already handled in slice
    }
    localStorage.removeItem("userType");
    setOpenModal(false);
    setSidebarOpen(false);
  };

  const isLoggedIn = isAuthenticated || isGeekAuthenticated;
  const displayName = user?.fullName?.first || geek?.fullName?.first || '';
  const supportUrl = `${process.env.NEXT_PUBLIC_SUPPORT_URL || 'https://god-support-hnhahmadccdvgtcz.southindia-01.azurewebsites.net'}/tickets?role=${
    isGeekAuthenticated ? 'geek' : 'seeker'
  }`;
  const ctaLabel = isGeekAuthenticated ? 'Become a Seeker' : isAuthenticated ? 'Earn as a Geek' : 'Book a Geek';
  const handleCta = () => {
    if (!isLoggedIn) {
      router.push('/register?type=seeker');
    } else if (isGeekAuthenticated) {
      toast.dismiss();
            showCustomToast(
              { title: "Logged in as a Geek.", message: "Please logout first to register as a Seeker.", type: "warning", avatar: "/assets/logo-big.webp" },
              { position: "top-center" }
            )
      toast.custom('Please logout first to book a Geek.', { position: 'top-center' });
    } else if (isAuthenticated) {
      toast.dismiss();
            showCustomToast(
              { title: "Logged in as a Seeker.", message: "Please logout first to register as a Geek.", type: "warning", avatar: "/assets/logo-big.webp" },
              { position: "top-center" }
            );
    } else {
      router.push('/register?type=geek');
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-20 bg-white shadow-sm">
        <div className="w-full h-full flex justify-between items-center lg:px-32 py-4 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/assets/logo-big.webp" width={140} height={57} alt="Geek on Demand" priority style={{ width: '140px', height: '57px' }} />
          </Link>

          {/* Center: navlinks (desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm px-3">
            {navlinks.map((navlink) =>
              navlink.isDropdown ? (
                <div
                  key={navlink.id}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServices}
                >
                  <button
                    className="group flex items-center gap-1 text-nowrap font-medium text-gray-700 hover:text-teal-600 transition-colors focus:outline-none cursor-pointer"
                    onClick={() => setServicesOpen((prev) => !prev)}
                  >
                    {navlink.name}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                        servicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {servicesOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                      <div className="w-[560px] bg-white rounded-2xl border border-gray-100 shadow-xl p-4">
                        {servicesDropdownPages.length === 0 ? (
                          <p className="px-2 py-6 text-center text-sm text-gray-400">No services available</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-1.5">
                            {servicesDropdownPages.map((page) => (
                              <Link
                                key={page._id}
                                href={`/category-pages/${page.slug}`}
                                onClick={() => setServicesOpen(false)}
                                className="group/item flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 transition-colors"
                              >
                                <div className="relative w-8 h-6 rounded-lg bg-teal-50 overflow-hidden shrink-0 flex items-center justify-center">
                                  {page.category?.smallBanner?.url ? (
                                    <Image
                                      src={page.category.smallBanner.url}
                                      alt={page.category.title}
                                      fill
                                      sizes="30px"
                                      className="object-contain"
                                    />
                                  ) : (
                                    <span className="text-teal-600 font-semibold text-sm">
                                      {(page.category?.title || '?').charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover/item:text-teal-700 truncate transition-colors">
                                  {page.category?.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Link
                            href="/category-pages"
                            onClick={() => setServicesOpen(false)}
                            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-teal-50 text-teal-700 font-semibold text-sm hover:bg-teal-100 transition-colors"
                          >
                            Show All Services
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={navlink.id}
                  href={navlink.link!}
                  className={`text-nowrap transition-colors ${
                    pathname === navlink.link
                      ? 'text-teal-600 font-semibold'
                      : 'text-gray-700 font-medium hover:text-teal-600'
                  }`}
                >
                  {navlink.name}
                </Link>
              )
            )}
          </nav>

          {/* Right: auth (desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-all duration-150 focus:outline-none cursor-pointer">
                  <UserRound className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-800 text-sm">{displayName}</span>
                  {isGeekAuthenticated && <NotifBadge count={geekUnread} />}
                  {isAuthenticated && !isGeekAuthenticated && <NotifBadge count={seekerUnread} />}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 p-1.5 rounded-xl border border-gray-100 shadow-xl duration-150"
                  align="end"
                  sideOffset={10}
                >
                  <DropdownMenuLabel className="px-2.5 py-2.5 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Signed in as</span>
                      <span className="text-sm font-semibold text-gray-800">{displayName}</span>
                    </div>
                    {isGeekAuthenticated && (
                      <Link
                        href={`/geeks/${geek?._id}/requests`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                      >
                        <Bell className="w-4 h-4 text-gray-400 hover:text-teal-600 transition-colors" />
                      </Link>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />

                  {isGeekAuthenticated && (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 gap-2.5 transition-colors"
                      onClick={() => router.push('/geeks/dashboard')}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  {isGeekAuthenticated && (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 gap-2.5 transition-colors"
                      onClick={() => router.push('/geeks/subscription')}
                    >
                      <CreditCard className="w-4 h-4" />
                      Subscription
                    </DropdownMenuItem>
                  )}
                  {isGeekAuthenticated && (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 gap-2.5 transition-colors"
                      onClick={() => router.push(`/geeks/${geek?._id}/requests`)}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                      <span className="ml-auto"><NotifBadge count={geekUnread} /></span>
                    </DropdownMenuItem>
                  )}
                  {isAuthenticated && (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 gap-2.5 transition-colors"
                      onClick={() => router.push(`/seeker/${user?._id}`)}
                    >
                      <UserRound className="w-4 h-4" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  {isAuthenticated && (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 gap-2.5 transition-colors"
                      onClick={() => router.push(`/seeker/${user?._id}/services`)}
                    >
                      <ClipboardList className="w-4 h-4" />
                      My Requests
                      <span className="ml-auto"><NotifBadge count={seekerUnread} /></span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700 gap-2.5 transition-colors"
                    onClick={() => { window.location.href = supportUrl; }}
                  >
                    <LifeBuoy className="w-4 h-4" />
                    Contact &amp; Support
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 gap-2.5 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <LogOut className="w-4 h-4" />
                    <CustomModel
                      text="Logout"
                      title="Are you sure you want to Logout?"
                      description="You will be logged out of your account."
                      onCancel={() => setOpenModal(false)}
                      onOk={handleLogout}
                      openModal={openModal}
                      setOpenModal={setOpenModal}
                      toggleModal={() => setOpenModal(!openModal)}
                      isOpen={openModal}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <CustomButton
              handleClick={handleCta}
              text={ctaLabel}
              type="submit"
              width="text-sm w-fit"
            />
          </div>

          {/* Mobile: hamburger */}
          <button className="flex lg:hidden p-1" onClick={() => setSidebarOpen(true)}>
            <Image src="/assets/icons/hamburger-menu.svg" width={24} height={14} alt="menu" />
          </button>
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <Image src="/assets/logo-big.webp" width={110} height={45} alt="Logo" style={{ width: '110px', height: '45px' }} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-4 gap-1 text-sm overflow-y-auto h-[calc(100%-65px)]">
          {/* Nav links */}
          <div className="flex flex-col gap-0.5">
            {navlinks.map((nav) =>
              nav.isDropdown ? (
                <div key={nav.id} className="flex flex-col">
                  <button
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    {nav.name}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <div className="flex flex-col gap-2 pl-2 pr-1 mt-1 pb-2">
                      {servicesDropdownPages.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-gray-400">No services available</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5">
                          {servicesDropdownPages.map((page) => (
                            <Link
                              key={page._id}
                              href={`/category-pages/${page.slug}`}
                              onClick={() => setSidebarOpen(false)}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="relative w-8 h-8 rounded-md bg-teal-50 overflow-hidden shrink-0 flex items-center justify-center">
                                {page.category?.smallBanner?.url ? (
                                  <Image
                                    src={page.category.smallBanner.url}
                                    alt={page.category.title}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <span className="text-teal-600 font-semibold text-xs">
                                    {(page.category?.title || '?').charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-600 truncate">
                                {page.category?.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                      <Link
                        href="/category-pages"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-teal-50 text-teal-700 text-sm font-semibold hover:bg-teal-100 transition-colors"
                      >
                        Show All Services
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={nav.id}
                  href={nav.link!}
                  onClick={() => setSidebarOpen(false)}
                  className={`px-3 py-2.5 rounded-lg transition-colors ${
                    pathname === nav.link
                      ? 'text-teal-600 font-semibold bg-teal-50'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                  }`}
                >
                  {nav.name}
                </Link>
              )
            )}
          </div>

          <div className="border-t mt-3 pt-3 flex flex-col gap-0.5">
            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setSidebarOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg text-center font-medium transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <>
                <p className="px-3 py-1.5 text-xs text-gray-400 uppercase tracking-wide font-semibold">
                  {displayName}
                </p>

                {isGeekAuthenticated && (
                  <Link
                    href="/geeks/dashboard"
                    onClick={() => setSidebarOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Profile
                  </Link>
                )}
                {isGeekAuthenticated && (
                  <Link
                    href="/geeks/subscription"
                    onClick={() => setSidebarOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Subscription
                  </Link>
                )}
                {isGeekAuthenticated && (
                  <Link
                    href={`/geeks/${geek?._id}/requests`}
                    onClick={() => setSidebarOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    Notifications
                    <NotifBadge count={geekUnread} />
                  </Link>
                )}
                {isAuthenticated && (
                  <Link
                    href={`/seeker/${user?._id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Profile
                  </Link>
                )}
                {isAuthenticated && (
                  <Link
                    href={`/seeker/${user?._id}/services`}
                    onClick={() => setSidebarOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    My Services
                    <NotifBadge count={seekerUnread} />
                  </Link>
                )}

                <a
                  href={supportUrl}
                  onClick={() => setSidebarOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <LifeBuoy className="w-4 h-4" />
                  Contact &amp; Support
                </a>

                <div className="mt-1 px-1">
                  <CustomModel
                    text="Logout"
                    title="Are you sure you want to Logout?"
                    description="You will be logged out of your account."
                    onCancel={() => setOpenModal(false)}
                    onOk={handleLogout}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    toggleModal={() => setOpenModal(!openModal)}
                    isOpen={openModal}
                  />
                </div>
              </>
            )}

            <div className="mt-2">
              <CustomButton
                handleClick={() => { handleCta(); setSidebarOpen(false); }}
                text={ctaLabel}
                type="submit"
                width="text-sm w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
