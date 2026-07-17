"use client"
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { loadUser } from '@/features/seeker/seekerSlice';
import toast from 'react-hot-toast';

const LoginSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(loadUser())
        .unwrap()
        .then(() => {
          localStorage.setItem('userType', 'seeker');
          router.push('/');
        })
        .catch(() => {
          router.push('/login');
          toast.error('Login Failed');
        });
    } else {
      router.push('/login');
      toast.error('Login Failed');
    }
  }, [dispatch, router, token]);

  return <p>Logging you in...</p>;
};

export default LoginSuccess;
