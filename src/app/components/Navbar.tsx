"use client";

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CustomButton from './CustomButton';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { logoutUser, UserState } from '@/features/seeker/seekerSlice';
import CustomModel from './CustomModal';
import { GeekInitialState, logoutGeek } from '@/features/geek/geekSlice';
import { Bell, UserRound } from 'lucide-react';
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

const NotifBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="text-white text-xs font-medium bg-red-500 px-1.5 py-0.5 rounded-full leading-none">
      {count}
    </span>
  ) : null;

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.seeker) as UserState;
  const geekState = useSelector((state: RootState) => state.geek) as GeekInitialState;
  const isGeekAuthenticated = geekState?.isAuthenticated;
  const geek = geekState?.geek;
  const seekerRequests = useSelector((state: RootState) => state.request.requests) as ServiceRequest[];

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

  const navlinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 5, name: "Blogs", link: "/blogs" },
    { id: 4, name: "Geeks", link: "/geeks" },
    { id: 3, name: "About Us", link: "/about" },
    { id: 2, name: "Contact Us", link: "/contact" },
  ];

  const handleLogout = () => {
    const userType = localStorage.getItem("userType");
    if (userType === "seeker") {
      dispatch(logoutUser());
    } else {
      dispatch(logoutGeek());
    }
    localStorage.removeItem("userType");
    setOpenModal(false);
    setSidebarOpen(false);
  };

  const isLoggedIn = isAuthenticated || isGeekAuthenticated;
  const displayName = user?.fullName?.first || geek?.fullName?.first || '';

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-20 bg-white shadow-sm">
        <div className="w-full h-full flex justify-between items-center lg:px-32 py-4 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/assets/logo-big.webp" width={140} height={18} alt="Geek on Demand" />
          </Link>

          {/* Center: navlinks (desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm">
            {navlinks.map((navlink) => (
              <Link
                key={navlink.id}
                href={navlink.link}
                className={`text-nowrap transition-colors ${
                  pathname === navlink.link
                    ? 'text-teal-600 font-semibold'
                    : 'text-gray-700 font-medium hover:text-teal-600'
                }`}
              >
                {navlink.name}
              </Link>
            ))}
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
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Welcome,</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 cursor-pointer focus:outline-none">
                    <span className="font-medium text-gray-800">{displayName}</span>
                    <UserRound className="w-5 h-5 text-gray-600" />
                    {isGeekAuthenticated && <NotifBadge count={geekUnread} />}
                    {isAuthenticated && !isGeekAuthenticated && <NotifBadge count={seekerUnread} />}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-52 mt-2">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>My Account</span>
                      {isGeekAuthenticated && (
                        <Link
                          href={`/geeks/${geek?._id}/requests`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Bell className="w-4 h-4 text-gray-500 hover:text-teal-600 transition-colors" />
                        </Link>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {isGeekAuthenticated && (
                      <DropdownMenuItem onClick={() => router.push('/geeks/dashboard')}>
                        My Profile
                      </DropdownMenuItem>
                    )}
                    {isGeekAuthenticated && (
                      <DropdownMenuItem onClick={() => router.push('/geeks/subscription')}>
                        Subscription
                      </DropdownMenuItem>
                    )}
                    {isGeekAuthenticated && (
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={() => router.push(`/geeks/${geek?._id}/requests`)}
                      >
                        Notifications
                        <NotifBadge count={geekUnread} />
                      </DropdownMenuItem>
                    )}
                    {isAuthenticated && (
                      <DropdownMenuItem onClick={() => router.push(`/seeker/${user?._id}`)}>
                        My Profile
                      </DropdownMenuItem>
                    )}
                    {isAuthenticated && (
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={() => router.push(`/seeker/${user?._id}/services`)}
                      >
                        My Services
                        <NotifBadge count={seekerUnread} />
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
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
              </div>
            )}

            {!isGeekAuthenticated && (
              <CustomButton
                handleClick={() => {
                  if (!isLoggedIn) {
                    router.push('/register?type=geek');
                  } else {
                    toast.error('Please logout first to register as a Geek.', { position: 'top-center' });
                  }
                }}
                text="Get Started"
                type="submit"
                width="text-sm w-fit"
              />
            )}
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
            <Image src="/assets/logo-big.webp" width={110} height={16} alt="Logo" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
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
            {navlinks.map((nav) => (
              <Link
                key={nav.id}
                href={nav.link}
                onClick={() => setSidebarOpen(false)}
                className={`px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === nav.link
                    ? 'text-teal-600 font-semibold bg-teal-50'
                    : 'text-gray-700 font-medium hover:bg-gray-50'
                }`}
              >
                {nav.name}
              </Link>
            ))}
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

            {!isGeekAuthenticated && (
              <div className="mt-2">
                <CustomButton
                  handleClick={() => {
                    if (!isLoggedIn) {
                      router.push('/register?type=geek');
                    } else {
                      toast.error('Please logout first to register as a Geek.', { position: 'top-center' });
                    }
                    setSidebarOpen(false);
                  }}
                  text="Get Started"
                  type="submit"
                  width="text-sm w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
