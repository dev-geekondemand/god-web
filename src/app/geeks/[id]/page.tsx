"use client"

import { getGeekById } from '@/features/geek/geekSlice'
import { useAppDispatch } from '@/lib/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Geek from '@/interfaces/Geek'
import { Category } from '@/interfaces/Category'
import { createRequest, getSeekerRequests } from '@/features/request/requestSlice'
import User from '@/interfaces/Seeker'
import DialogComponent from '@/app/components/Dialog'
import { ServiceRequest } from '@/interfaces/ServiceRequest'
import Brand from '@/interfaces/Brand'
import { getBrands } from '@/features/brands/brandsSlice'
import GlobalSkeleton from '@/app/components/Sekeletn'
import PageBanner from '@/app/components/PageBanner'

interface SkillWithBrands {
  category: Category
  brands: Brand[]
}

const PLAN_COLOR: Record<string, string> = {
  Professional: 'bg-amber-100 text-amber-700 border-amber-200',
  Advance: 'bg-teal-100 text-teal-700 border-teal-200',
  Startup: 'bg-gray-100 text-gray-500 border-gray-200',
}

const GeekById = () => {
  const dispatch = useAppDispatch()
  const params = useParams()
  const id = params.id
  const catId = useSearchParams().get('categoryId')
  const categoryId = catId && catId !== 'undefined' ? catId : null

  const [skills, setSkills] = useState<Category[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Category>()
  const [selectedMode, setSelectedMode] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [isSeekerAddress, setIsSeekerAddress] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRequestedService, setIsRequestedService] = useState(false)
  const [primarySkillBrands, setPrimarySkillBrands] = useState<Brand[]>([])
  const [secondarySkillsWithBrands, setSecondarySkillsWithBrands] = useState<SkillWithBrands[]>([])
  const [overView, setOverview] = useState(true)
  const [expertise, setExpertise] = useState(true)

  const azureLoader = ({ src }: { src: string }) => src

  useEffect(() => {
    if (id) {
      dispatch(getGeekById(id.toString()))
      dispatch(getBrands())
      dispatch(getSeekerRequests())
    } else {
      toast.error('Geek not found')
    }
  }, [dispatch, id])

  const geek = useSelector((state: RootState) => state.geek?.geekById) as Geek
  const loggedInGeek = useSelector((state: RootState) => state.geek?.geek) as Geek
  const isGeekLoading = useSelector((state: RootState) => state.geek?.isLoading)
  const loggedInSeeker = useSelector((state: RootState) => state.seeker?.user) as User
  const requestState = useSelector((state: RootState) => state.request)
  const seekerRequests = useSelector((state: RootState) => state.request?.requests) as ServiceRequest[]
  const brands = useSelector((state: RootState) => state.brand?.brands) as Brand[]

  const isCorporate = !!(geek?.__t === 'Corporate' || geek?.companyName) 

  useEffect(() => {
    if (geek?.primarySkill) {
      const allSkills = [geek.primarySkill, ...geek.secondarySkills]
      setSkills(allSkills)
      if (categoryId) {
        const matched = allSkills.find(s => s._id === categoryId)
        if (matched) setSelectedSkill(matched)
      }
    }
  }, [geek?.primarySkill, geek?.secondarySkills, categoryId])

  const handleClick = () => {
    if (!geek?._id) { toast.error('Geek not found'); return }
    if (loggedInGeek?._id === geek._id) { toast.error('You cannot book your own service'); return }
    if (!loggedInSeeker?._id) { toast.error('You are not logged in as a Seeker.'); return }
    setShowDialog(true)
  }

  const handleBookService = async () => {
    const finalCategoryId = selectedSkill?._id || categoryId
    if (!finalCategoryId) { toast.error('Please select a category.'); return }
    if (!selectedMode) { toast.error('Please select a mode of service.'); return }
    if (selectedMode === 'Offline' && !isSeekerAddress) { toast.error('Please add your address first.'); return }
    if (requestState?.requests?.length > 0) {
      const alreadyExists = seekerRequests?.some(r =>
        r?.category?._id === finalCategoryId && r?.geek?._id === geek?._id && r?.geekResponseStatus === 'Pending'
      )
      if (alreadyExists) { toast.error('You already have a pending request for this category.'); return }
    }
    setIsLoading(true)
    await dispatch(createRequest({ geek: geek._id, category: finalCategoryId, issue: '', mode: selectedMode, location: { city: '', state: '', line1: '' } }))
    dispatch(getSeekerRequests())
    setIsLoading(false)
    setShowDialog(false)
  }

  useEffect(() => {
    const requested = (requestState?.requests as ServiceRequest[] | undefined)?.some(
      r => r?.geek?._id === geek?._id && r?.geekResponseStatus === 'Accepted'
    )
    setIsRequestedService(!!requested)
  }, [requestState, geek?._id])

  useEffect(() => {
    if (requestState?.isRequestCreated) { toast.dismiss(); toast.success('Request created successfully.') }
  }, [requestState?.isRequestCreated])

  useEffect(() => {
    if (loggedInSeeker?.address?.city) setIsSeekerAddress(true)
  }, [loggedInSeeker?.address?.city])

  useEffect(() => {
    if (!geek || brands.length === 0) return
    const primaryCategoryId = geek.primarySkill?._id
    setPrimarySkillBrands(brands.filter(b => b.category?._id === primaryCategoryId && geek.brandsServiced?.some(gb => gb._id === b._id)))
    setSecondarySkillsWithBrands(
      geek.secondarySkills?.map(cat => ({
        category: cat,
        brands: brands.filter(b => b.category?._id === cat._id && geek.brandsServiced?.some(gb => gb._id === b._id)),
      })) || []
    )
  }, [geek, brands])

  if (isGeekLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto p-8">
          <GlobalSkeleton cards={3} cols={1} lgCols={1} />
        </div>
      </div>
    )
  }

  const planLabel = geek?.subscriptionPlan || 'Startup'
  const planColorClass = PLAN_COLOR[planLabel] || PLAN_COLOR.Startup
  const isVerified = geek?.idProof?.isAdhaarVerified

  return (
    <section className="w-full flex flex-col items-center justify-center bg-gray-50 min-h-screen">

      <PageBanner
        title={`${geek?.fullName?.first ?? ''} ${geek?.fullName?.last ?? ''}`.trim() || 'Geek Profile'}
        crumbs={[
          { label: 'Geeks', href: '/geeks' },
          { label: `${geek?.fullName?.first ?? ''} ${geek?.fullName?.last ?? ''}`.trim() || 'Geek Profile' },
        ]}
      />

      <div className="w-full max-w-6xl mx-auto px-4 py-10 flex flex-col gap-6">

        {/* ── Hero Card ─────────────────────────────────────────────────── */}
        <div className={`w-full rounded-2xl shadow-sm overflow-hidden border ${isCorporate ? 'border-indigo-200' : 'border-gray-200'} bg-white`}>

          {/* Accent bar */}
          <div className={`h-1.5 w-full ${isCorporate ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`} />

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 ${isCorporate ? 'border-indigo-200' : 'border-teal-200'} shadow`}>
                <Image
                  loader={azureLoader}
                  src={geek?.profileImage?.url || '/assets/images/placeholder_user.jpg'}
                  alt={geek?.fullName?.first || 'Geek'}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white rounded-full p-1 shadow">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {isCorporate && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H3m8-10h.01M12 17h.01M9 17h.01" />
                    </svg>
                    Corporate
                  </span>
                )}
                {planLabel !== 'Startup' && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${planColorClass}`}>
                    {planLabel}
                  </span>
                )}
                {isVerified && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    ID Verified
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {geek?.fullName?.first} {geek?.fullName?.last}
              </h1>

              {isCorporate && geek?.companyName && (
                <p className="text-base font-medium text-indigo-600 mt-0.5 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H3m8-10h.01M12 17h.01M9 17h.01" />
                  </svg>
                  {geek.companyName}
                </p>
              )}

              <p className="text-gray-500 mt-1">{geek?.primarySkill?.title}</p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {geek?.address?.city && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {geek.address.city}, {geek.address.state}
                  </span>
                )}
                {geek?.yoe != null && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {geek.yoe} yr{geek.yoe !== 1 ? 's' : ''} experience
                  </span>
                )}
                {geek?.modeOfService && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {geek.modeOfService}
                  </span>
                )}
                {isCorporate && geek?.teamSize && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Team of {geek.teamSize}
                  </span>
                )}
              </div>
            </div>

            {/* Book button — desktop */}
            <div className="shrink-0 hidden sm:flex flex-col items-end gap-2">
              <button
                onClick={handleClick}
                className={`px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow transition ${isCorporate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
              >
                Book Service
              </button>
              {isCorporate && geek?.GSTIN && (
                <span className="text-xs text-gray-400">GSTIN: {geek.GSTIN}</span>
              )}
            </div>
          </div>

          {/* Book button — mobile */}
          <div className="px-6 pb-6 sm:hidden">
            <button
              onClick={handleClick}
              className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow transition ${isCorporate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
            >
              Book Service
            </button>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — main content */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setOverview(!overView)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-base font-semibold text-gray-900">Overview</span>
                <svg viewBox="0 0 1024 1024" className={`w-4 h-4 transition-transform ${overView ? 'rotate-180' : ''}`} fill="currentColor">
                  <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" />
                </svg>
              </button>
              {overView && (
                <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {isCorporate && geek?.companyName ? (
                    <>
                      <p>
                        <span className="font-medium text-gray-800">{geek.companyName}</span> is a corporate service provider
                        based in {geek?.address?.city}, {geek?.address?.state}, specialising in {geek?.primarySkill?.title}.
                        The team has over {geek?.yoe} years of combined experience delivering reliable solutions.
                      </p>
                      {geek?.email && (
                        <p className="mt-2">
                          You can reach them at{' '}
                          <a className="text-indigo-600 hover:underline" href={`mailto:${geek.email}`}>
                            {isRequestedService ? geek.email : '***@***.com'}
                          </a>.
                        </p>
                      )}
                    </>
                  ) : (
                    <p>
                      Hello, I am {geek?.fullName?.first} {geek?.fullName?.last} from {geek?.address?.city}, {geek?.address?.state}.
                      I have been delivering quality service for the past {geek?.yoe} years in the field of {geek?.primarySkill?.title}.
                      If you need hassle-free solutions for {geek?.primarySkill?.title} at a reasonable price, click <strong>Book Service</strong>.
                      {geek?.email && (
                        <> You can also email me at{' '}
                          <a className="text-teal-600 hover:underline" href={`mailto:${geek.email}`}>
                            {isRequestedService ? geek.email : '***@***.com'}
                          </a>.
                        </>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Areas of Expertise */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpertise(!expertise)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-base font-semibold text-gray-900">Areas of Expertise</span>
                <svg viewBox="0 0 1024 1024" className={`w-4 h-4 transition-transform ${expertise ? 'rotate-180' : ''}`} fill="currentColor">
                  <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" />
                </svg>
              </button>
              {expertise && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4 flex flex-col gap-5">

                  {/* Primary skill */}
                  {geek?.primarySkill ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Primary Skill</p>
                      <div className="rounded-xl border border-gray-200 p-4">
                        <p className="font-semibold text-sm text-gray-800 mb-2">{geek.primarySkill.title}</p>
                        <div className="flex flex-wrap gap-2">
                          {primarySkillBrands.length > 0 ? primarySkillBrands.map(b => (
                            <span key={b._id} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{b.name}</span>
                          )) : (
                            <span className="text-xs text-gray-400">No brands listed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Secondary skills */}
                  {secondarySkillsWithBrands.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Secondary Skills</p>
                      <div className="flex flex-col gap-3">
                        {secondarySkillsWithBrands.map(({ category, brands }) => (
                          <div key={category._id} className="rounded-xl border border-gray-200 p-4">
                            <p className="font-semibold text-sm text-gray-800 mb-2">{category.title}</p>
                            <div className="flex flex-wrap gap-2">
                              {brands.length > 0 ? brands.map(b => (
                                <span key={b._id} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{b.name}</span>
                              )) : (
                                <span className="text-xs text-gray-400">No brands listed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rate card */}
            {geek?.rateCard?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <p className="text-base font-semibold text-gray-900 mb-4">Rate Card</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {geek.rateCard.map(card => (
                    <div key={card._id} className="rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{card.skill?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{card.chargeType}</p>
                      </div>
                      <span className="text-sm font-semibold text-teal-700">₹{card.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-base font-semibold text-gray-900 mb-4">What You Get</p>
              <div className="flex flex-wrap gap-3">
                {['Warranty & Support', 'Workmanship Guarantee', 'Energy-Efficient Solutions'].map(item => (
                  <div key={item} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
              <p className="text-base font-semibold text-gray-900">Contact Info</p>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Email</span>
                  <span className="text-gray-700 break-all">
                    {geek?.email
                      ? (isRequestedService ? geek.email : '**********@***.com')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Phone</span>
                  <span className="text-gray-700">
                    {geek?.mobile
                      ? (isRequestedService
                          ? geek.mobile
                          : geek.mobile.slice(0, 3) + '****' + geek.mobile.slice(-3))
                      : 'N/A'}
                  </span>
                </div>
                {geek?.languagePreferences?.length > 0 && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Languages</span>
                    <span className="text-gray-700">{geek.languagePreferences.join(', ')}</span>
                  </div>
                )}
                {isCorporate && geek?.GSTIN && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      GSTIN
                      <span className="text-green-500 text-xs font-semibold">✓ Verified</span>
                    </span>
                    <span className="text-gray-700 font-mono text-xs tracking-wider">
                      {geek.GSTIN.slice(0, 2)}{"·".repeat(9)}{geek.GSTIN.slice(-4)}
                    </span>
                  </div>
                )}
                {isCorporate && geek?.CIN && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      CIN
                      <span className="text-green-500 text-xs font-semibold">✓ Verified</span>
                    </span>
                    <span className="text-gray-700 font-mono text-xs tracking-wider">
                      {geek.CIN.slice(0, 3)}{"·".repeat(12)}{geek.CIN.slice(-6)}
                    </span>
                  </div>
                )}
              </div>

              {!isRequestedService && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2 text-center">
                  Full contact details unlock after your service request is accepted.
                </p>
              )}
            </div>

            {/* Select Category */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-base font-semibold text-gray-900 mb-4">Select Category</p>
              {isGeekLoading ? (
                <GlobalSkeleton cards={2} cols={1} lgCols={1} />
              ) : (
                <div className="flex flex-col gap-2">
                  {skills?.map((skill: Category) => (
                    <button
                      key={skill._id}
                      onClick={() => setSelectedSkill(skill)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition border ${
                        selectedSkill?._id === skill._id
                          ? isCorporate
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-teal-400 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 relative">
                        <Image
                          loader={azureLoader}
                          src={skill?.image?.url || '/assets/images/placeholder_user.jpg'}
                          alt={skill.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{skill.title}</span>
                      {selectedSkill?._id === skill._id && (
                        <svg className={`w-4 h-4 ml-auto shrink-0 ${isCorporate ? 'text-indigo-500' : 'text-teal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleClick}
                className={`mt-4 w-full py-2.5 rounded-xl text-white font-semibold text-sm shadow transition ${isCorporate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
              >
                Book Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <DialogComponent
          modes={geek?.modeOfService === 'All' || geek?.modeOfService === 'None' ? ['Online', 'Offline', 'Carry In'] : [geek?.modeOfService]}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          seekerId={loggedInSeeker?._id}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          title="Book Service"
          titleDesc="Select a category and mode to confirm your booking."
          onSubmit={handleBookService}
          isSeekerAddress={isSeekerAddress}
          skills={categoryId ? undefined : skills}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          isLoading={isLoading}
        />
      )}
    </section>
  )
}

export default GeekById
