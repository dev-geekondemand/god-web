"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PageBanner from './PageBanner'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getOtp } from "../../features/seeker/seekerSlice"
import { useAppDispatch } from '@/lib/hooks'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Image from 'next/image'
import { url } from '@/utils/url'
import { getCategories } from '@/features/category/categorySlice'
import { sendGeekOTP } from '@/features/geek/geekSlice'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import Brand from '@/interfaces/Brand'
import { getBrandsByCategory } from '@/features/brands/brandsSlice'
import { Multiselect } from 'react-widgets/cjs'
import "react-widgets/styles.css"

const inputCls = 'block w-full px-3.5 py-3 text-sm text-gray-900 bg-[#f6f6f6] rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'
const errorCls = 'mt-1 text-xs text-red-500'

interface FormData {
  refCode: string
  firstName: string
  lastName: string
  phone: string
  category: string
  yoe: number
  brands: Brand[]
}

interface Category {
  _id: string
  title: string
  slug: string
  subCategories: Array<object>
}

const Register = () => {
  const query = useSearchParams()
  const type = query.get('type')
  const [selected, setSelected] = useState<'Seeker' | 'Geek' | ''>('')
  const dispatch = useAppDispatch()
  const router = useRouter()

  const getValidationSchema = (sel: string) =>
    Yup.object({
      firstName: Yup.string()
        .required("First Name is required")
        .min(3, "Minimum 3 letters")
        .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed"),
      lastName: Yup.string()
        .required("Last Name is required")
        .min(3, "Minimum 3 letters")
        .matches(/^[a-zA-Z]+$/, "Only alphabets are allowed"),
      phone: Yup.string()
        .required("Phone is required")
        .length(10, "Phone number must be 10 digits"),
      category: Yup.string().when([], {
        is: () => sel === 'Geek',
        then: (schema) => schema.required("Category is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      yoe: Yup.number().when([], {
        is: () => sel === 'Geek',
        then: (schema) => schema.required("Years of experience is required").min(0).max(60),
        otherwise: (schema) => schema.notRequired(),
      }),
      refCode: Yup.string(),
      brands: Yup.array().when([], {
        is: () => sel === 'Geek',
        then: (schema) => schema.required("Brands are required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    })

  const initialValues: FormData = {
    firstName: "",
    lastName: "",
    phone: "",
    category: "",
    refCode: "",
    yoe: 0,
    brands: [],
  }

  const formik = useFormik({
    initialValues,
    validationSchema: getValidationSchema(selected),
    onSubmit: (values) => {
      if (selected === 'Seeker') dispatch(getOtp(values.phone))
      else dispatch(sendGeekOTP(values.phone))
    },
  })

  const seekerState = useSelector((state: RootState) => state.seeker)
  const geekState = useSelector((state: RootState) => state.geek)
  const brandsByCategory = useSelector((state: RootState) => state.brand.brandsByCategory?.brands) as Brand[]
  const categories: Category[] = useSelector((state: RootState) => state.category.categories as Category[])

  const allBrands = brandsByCategory?.map((brand) => ({ name: brand.name, _id: brand._id }))

  useEffect(() => {
    if (
      (seekerState?.isSuccess && seekerState?.isOTPSent) ||
      (geekState?.isSuccess && geekState?.isOTPSent)
    ) {
      const { firstName, lastName, phone, category, yoe } = formik.values
      if (selected === "Seeker") {
        if (firstName && lastName && phone) {
          router.push(`/verify-otp?phone=${phone}&firstName=${firstName}&lastName=${lastName}&refCode=${formik.values.refCode}&context=register&selected=${selected}`)
        }
      } else {
        if (firstName && lastName && phone && category && yoe !== 0 && formik.values.brands.length > 0) {
          const brands = formik.values.brands.map((b: Brand) => b._id)
          router.push(`/verify-otp?phone=${phone}&firstName=${firstName}&lastName=${lastName}&category=${category}&yoe=${yoe}&refCode=${formik.values.refCode}&brands=${JSON.stringify(brands)}&context=register&selected=${selected}`)
        }
      }
    }
  }, [seekerState?.isSuccess, geekState?.isSuccess, formik.values, selected, seekerState?.isOTPSent, geekState?.isOTPSent])

  useEffect(() => {
    if (selected === 'Geek') formik.setFieldValue('brands', [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.category])

  useEffect(() => {
    if (seekerState?.isAuthenticated || geekState?.isAuthenticated) {
      toast.error('You are already logged in.')
      router.push('/')
    }
  }, [seekerState, geekState, selected])

  useEffect(() => {
    if (type === 'geek' && selected !== 'Seeker') setSelected('Geek')
    if (selected === 'Geek') dispatch(getCategories())
    if (selected === '' && type !== 'geek') setSelected('Seeker')
  }, [selected, dispatch, type])

  useEffect(() => {
    if (formik.values.category && selected === 'Geek') {
      dispatch(getBrandsByCategory(formik.values.category))
    }
  }, [formik.values.category, selected, dispatch])

  const handleGoogleLogin = () => { window.location.href = `${url}seeker/google` }
  const handleMSLogin = () => { window.location.href = `${url}seeker/microsoft` }

  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <PageBanner title="Register" crumbs={[{ label: 'Register' }]} />

      {/* Registration type tabs */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-sm mx-auto px-3 flex items-center overflow-x-auto">
          <span
            onClick={() => setSelected('Seeker')}
            className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition cursor-pointer ${selected === 'Seeker' ? 'text-teal-700 font-semibold border-teal-600' : 'text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-800'}`}
          >
            Seeker
          </span>
          <span
            onClick={() => setSelected('Geek')}
            className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition cursor-pointer ${selected === 'Geek' ? 'text-teal-700 font-semibold border-teal-600' : 'text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-800'}`}
          >
            Individual Geek
          </span>
          <Link
            href="/register/corporate"
            className="px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-gray-800 whitespace-nowrap border-b-2 border-transparent hover:border-gray-300 transition"
          >
            Corporate Geek
          </Link>
        </div>
      </div>

      <div className='py-20 px-3 w-full flex items-center justify-center'>
        <div className='w-sm mx-auto flex flex-col gap-8 items-center justify-center'>

          <div className='w-full flex items-center justify-between'>
            <Link href="/login/geek" className='text-sm text-teal-600 underline underline-offset-2 hover:text-teal-700'>Login as Geek?</Link>
            <Link href="/login/seeker" className='text-sm text-teal-600 underline underline-offset-2 hover:text-teal-700'>Login as Seeker?</Link>
          </div>

          {selected === 'Seeker' && (
            <div className='flex items-center justify-center gap-2 w-full'>
              <button onClick={handleGoogleLogin} className='w-full flex items-center justify-start'>
                <Image src="/google_SI_light.svg" width={155} height={155} alt="Sign In with Google" />
              </button>
              <button onClick={handleMSLogin} className='w-full flex items-center justify-start'>
                <Image src="/ms_signin_light.svg" width={205} height={205} alt="Sign In with Microsoft" />
              </button>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-4'>

            {/* Type toggle */}
            {/* <div className="flex gap-6 items-center w-full">
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="Geek"
                  checked={selected === 'Geek'}
                  onChange={() => setSelected('Geek')}
                  className="accent-teal-500 w-3 h-3"
                />
                <span className="text-sm text-gray-600">Geek</span>
              </label>
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="Seeker"
                  checked={selected === 'Seeker'}
                  onChange={() => setSelected('Seeker')}
                  className="accent-teal-500 w-3 h-3"
                />
                <span className="text-sm text-gray-600">Seeker</span>
              </label>
            </div> */}

            {/* Referral code */}
            <div>
              <label className={labelCls}>Referral Code</label>
              <input
                name="refCode"
                onChange={formik.handleChange}
                value={formik.values.refCode}
                type="text"
                placeholder="Enter referral code (optional)"
                className={inputCls}
              />
              {formik.touched.refCode && formik.errors.refCode && (
                <p className={errorCls}>{formik.errors.refCode}</p>
              )}
            </div>

            {/* First name */}
            <div>
              <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
              <input
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                type="text"
                placeholder="Ravi"
                className={inputCls}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className={errorCls}>{formik.errors.firstName}</p>
              )}
            </div>

            {/* Last name */}
            <div>
              <label className={labelCls}>Last Name <span className="text-red-500">*</span></label>
              <input
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                type="text"
                placeholder="Kumar"
                className={inputCls}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className={errorCls}>{formik.errors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
              <input
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                type="text"
                placeholder="10-digit mobile number"
                className={inputCls}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className={errorCls}>{formik.errors.phone}</p>
              )}
            </div>

            {/* Geek-only fields */}
            {selected === 'Geek' && (
              <>
                <div>
                  <label className={labelCls}>Primary Skill <span className="text-red-500">*</span></label>
                  <select
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                    name="category"
                    className='block w-full px-3.5 py-3 text-sm text-gray-700 bg-[#f6f6f6] rounded-lg outline-none focus:ring-2 focus:ring-teal-500/30 transition'
                  >
                    <option value="">Select category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className={errorCls}>{formik.errors.category}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Brands Serviced <span className="text-red-500">*</span></label>
                  <Multiselect
                    data={allBrands}
                    dataKey="_id"
                    textField="name"
                    value={formik.values.brands?.map((b) => b._id)}
                    onChange={(value) => formik.setFieldValue("brands", value)}
                    placeholder="Select brands"
                  />
                  {formik.touched.brands && formik.errors.brands && (
                    Array.isArray(formik.errors.brands)
                      ? formik.errors.brands.map((e, i) => <p key={i} className={errorCls}>{e?.toString()}</p>)
                      : <p className={errorCls}>{String(formik.errors.brands)}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Years of Experience <span className="text-red-500">*</span></label>
                  <input
                    name="yoe"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.yoe}
                    type="number"
                    min={0}
                    placeholder="0"
                    className={inputCls}
                  />
                  {formik.touched.yoe && formik.errors.yoe && (
                    <p className={errorCls}>{formik.errors.yoe}</p>
                  )}
                </div>
              </>
            )}

            <button type='submit' disabled={formik.isSubmitting} className='text-white cursor-pointer bg-teal-500 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-6 py-2 w-full'>
              <span>Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register
