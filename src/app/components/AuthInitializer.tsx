"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadUser, UserState } from "@/features/seeker/seekerSlice";
import { GeekInitialState, loadGeek } from "@/features/geek/geekSlice";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";



export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const seeker = useSelector((state: RootState) => state.seeker) as UserState;
  const geek = useSelector((state: RootState) => state.geek) as GeekInitialState ;

  useEffect(() => {
    // Only dispatch if not already authenticated
    if (!seeker.user?.fullName && !seeker.isAuthenticated) {
      dispatch(loadUser());
    }
    if (!geek.geek?.fullName && !geek.isAuthenticated) {
      dispatch(loadGeek());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set userType based on who is authenticated
  useEffect(() => {
    if (seeker.isAuthenticated && seeker.user?.fullName) {
      localStorage.setItem("userType", "seeker");
    } else if (geek.isAuthenticated && geek.geek?.fullName) {
      localStorage.setItem("userType", "geek");
    }
  }, [seeker.isAuthenticated, seeker.user, geek.isAuthenticated, geek.geek]);

  return null;
}
