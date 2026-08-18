"use client"
import { loginGeek, sendGeekOTP } from '@/features/geek/geekSlice'
import { useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import PageBanner from '../../components/PageBanner'

const inputCls = 'block w-full px-3.5 py-3 text-sm text-gray-900 bg-[#f6f6f6] rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'
const errorCls = 'mt-1 text-xs text-red-500'

const LoginGeek = () => {
  const [isOTPSent, setIsOTPSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [otpPhone, setOtpPhone] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => { setIsOTPSent(false);  }, [])

  const dispatch = useAppDispatch()
  const router = useRouter()

  const validationSchema = useMemo(
    () =>
      Yup.object({
        phone: Yup.string().required("Phone is required").length(10, "Must be 10 digits"),
        otp: isOTPSent
          ? Yup.string().required("OTP is required").length(6, "OTP must be 6 digits")
          : Yup.string().notRequired(),
      }),
    [isOTPSent],
  )
    

  const formik = useFormik({
    initialValues: { phone: '', otp: '' },
    validationSchema,
    onSubmit: () => {
      if (!isOTPSent) {
        dispatch(sendGeekOTP(formik.values.phone))
      } else {
        dispatch(loginGeek({ phone: formik.values.phone, otp: +formik.values.otp }))
        setIsOTPSent(false)
      }
    },
  })

  const geekState = useSelector((state: RootState) => state.geek)

  useEffect(() => {
    if (geekState?.isAuthenticated) {
      router.push('/')
    } else if (geekState?.isOTPSent && !isOTPSent) {
      setIsOTPSent(true)
      setOtpPhone(formik.values.phone)
      setResendTimer(30)
      setCanResend(false)
    }
  }, [geekState, isOTPSent])

  useEffect(() => {
    if (isOTPSent && otpPhone && formik.values.phone !== otpPhone) {
      setIsOTPSent(false)
      setCanResend(false)
      setResendTimer(30)
      setOtpPhone(null)
    }
  }, [formik.values.phone, isOTPSent, otpPhone])

  useEffect(() => {
    if (!isOTPSent || canResend) return
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isOTPSent, canResend])

  const handleResendOTP = async () => {
    if (!canResend || isResending) return
    setIsResending(true)
    await dispatch(sendGeekOTP(formik.values.phone))
    toast.success("OTP resent")
    setResendTimer(30)
    setCanResend(false)
    setIsResending(false)
  }

  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <PageBanner
        title="Geek Login"
        crumbs={[{ label: 'Login', href: '/login' }, { label: 'Geek' }]}
      />

      <div className='py-20 w-full flex items-center justify-center px-3'>
        <div className='w-sm mx-auto flex flex-col items-center gap-8 justify-center'>

          <div className='w-full flex items-center justify-center gap-4'>
                        <p className='cursor-pointer text-gray-800 '>Don&apos;t have an account yet?</p>
            <Link href="/register?type=geek" className='text-sm text-teal-600 underline underline-offset-2 hover:text-teal-700'>
              Sign Up
            </Link>
          </div>

          <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-5'>

            <div>
              <label className={labelCls}>Mobile Number</label>
              <input
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="tel"
                placeholder="10-digit mobile number"
                className={inputCls}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className={errorCls}>{formik.errors.phone}</p>
              )}
            </div>

            {isOTPSent && (
              <div>
                <label className={labelCls}>OTP</label>
                <input
                  name="otp"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  placeholder="6-digit OTP"
                  className={inputCls} 
                /> 
                {formik.touched.otp && formik.errors.otp && (
                  <p className={errorCls}>{formik.errors.otp}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isResending || geekState?.isLoading}
              className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white py-2 rounded  w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isResending || geekState?.isLoading ? 'Please wait…' : 'Sign In'}</span>
            </button>

            {isOTPSent && (
              <div className="flex justify-between items-center text-sm">
                {!canResend ? (
                  <p className="text-gray-500">
                    Resend OTP in <span className="font-semibold">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-teal-600 hover:underline font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

                                  
    </section>
  )
}

export default LoginGeek
