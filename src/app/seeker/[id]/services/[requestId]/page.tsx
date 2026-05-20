'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { getRequestById } from '@/features/request/requestSlice';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import PageBanner from '@/app/components/PageBanner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Review, ServiceRequest } from '@/interfaces/ServiceRequest';
import User from '@/interfaces/Seeker';
import { useSelector } from 'react-redux';
import ReviewInput from '@/app/components/ReviewInput';

const statusConfig: Record<string, { className: string; dot: string }> = {
  Pending:   { className: 'bg-amber-50 text-amber-700 border border-amber-200',  dot: 'bg-amber-400' },
  Matched:   { className: 'bg-teal-50 text-teal-700 border border-teal-200',    dot: 'bg-teal-400' },
  Accepted:  { className: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500' },
  Completed: { className: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500' },
  Rejected:  { className: 'bg-red-50 text-red-700 border border-red-200',       dot: 'bg-red-400' },
  Cancelled: { className: 'bg-red-50 text-red-700 border border-red-200',       dot: 'bg-red-400' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = statusConfig[status] || { className: 'bg-gray-100 text-gray-500 border border-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${s.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const Section = ({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: ReactNode;
}) => (
  <div className="w-full border-b border-gray-100 last:border-0 py-4">
    <button onClick={onToggle} className="flex items-center justify-between w-full text-left gap-3">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <svg
        viewBox="0 0 1024 1024"
        className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        fill="currentColor"
      >
        <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" />
      </svg>
    </button>
    {open && <div className="mt-3">{children}</div>}
  </div>
);

const fmt = (d?: Date | string) =>
  d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : null;

const hasExplicitSlot = (r?: ServiceRequest | null) =>
  !!r?.scheduledAt && !!r?.createdAt &&
  new Date(r.scheduledAt).getTime() - new Date(r.createdAt).getTime() > 30000;

const BookingTimeline = ({ request }: { request: ServiceRequest }) => {
  const steps: { label: string; value: string | null; icon: ReactNode; done: boolean }[] = [
    {
      label: 'Request Placed',
      value: fmt(request?.createdAt),
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      done: true,
    },
    ...(hasExplicitSlot(request) ? [{
      label: 'Preferred Slot',
      value: fmt(request.scheduledAt),
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      done: true,
    }] : []),
    {
      label: request?.geekResponseStatus === 'Rejected' ? 'Geek Rejected' : 'Geek Accepted',
      value: fmt(request?.responseAt),
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      done: !!request?.responseAt && (request?.geekResponseStatus === 'Accepted' || request?.geekResponseStatus === 'Rejected' || request?.geekResponseStatus === 'Completed'),
    },
    {
      label: 'Service Completed',
      value: request?.status === 'Completed' ? fmt(request?.responseAt) : null,
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      done: request?.status === 'Completed',
    },
  ];

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step.icon}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${step.done ? 'bg-teal-200' : 'bg-gray-100'}`} />
            )}
          </div>
          <div className="pb-4 min-w-0">
            <p className={`text-sm font-medium ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
            {step.value ? (
              <p className="text-xs text-gray-400 mt-0.5">{step.value}</p>
            ) : (
              <p className="text-xs text-gray-300 mt-0.5 italic">—</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SingleRequestPage = () => {
  const requestId = useParams().requestId as string;
  const seekerId = useParams()?.id as string;
  const dispatch = useAppDispatch();

  const [overView, setOverview] = useState(true);
  const [includes, setIncludes] = useState(true);
  const [gallery, setGallery] = useState(true);
  const [video, setVideo] = useState(true);

  const seeker = useSelector((state: RootState) => state.seeker?.user) as User;

  useEffect(() => {
    dispatch(getRequestById(requestId));
  }, [dispatch, requestId]);

  const request = useAppSelector((state: RootState) => state.request?.request) as ServiceRequest;

  const alreadyReviewed = request?.reviews?.some((r: Review) => r?.postedBy?._id === seeker?._id);
  const isOwner = request?.seeker?._id === seeker?._id;
  const isCompleted = request?.status === 'Completed';

  return (
    <section className="w-full h-full relative flex flex-col items-center justify-center gap-5">
      <PageBanner
        title={request?.category?.title || 'Service Detail'}
        crumbs={[
          { label: 'My Services', href: `/seeker/${seekerId}/services` },
          { label: request?.category?.title || 'Service Detail' },
        ]}
      />

      <div className="grid py-8 grid-cols-12 gap-6 w-full max-w-7xl mx-auto px-4 pb-16">
        {/* Left Column */}
        <div className="md:col-span-8 col-span-12 flex flex-col gap-5">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Hero Image with overlay */}
            <div className="w-full h-60 sm:h-72 relative bg-gray-100">
              <Image
                src={request?.category?.image?.url || '/assets/images/blogImg.jpg'}
                alt={request?.category?.title || 'Service'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 853px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">{request?.category?.title}</h2>
                <StatusBadge status={request?.status} />
              </div>
            </div>

            <div className="px-5 py-5 flex flex-col gap-1">
              {/* Meta row */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {(request?.address?.city || request?.geek?.address?.city) && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {request?.address
                      ? `${request.address.city}, ${request.address.state}`
                      : `${request?.geek?.address?.city}, ${request?.geek?.address?.state}`}
                  </span>
                )}
                {request?.reviews?.find((r: Review) => r?.postedBy?._id === seeker?._id)?.rating && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{request.reviews.find((r: Review) => r?.postedBy?._id === seeker?._id)?.rating}</span>
                    <span className="text-gray-400">/ 5</span>
                  </span>
                )}
              </div>

              {/* Uploaded Images Carousel */}
              {request?.images?.length > 0 && (
                <div className="mt-4">
                  <Carousel opts={{ align: 'start' }} className="w-full">
                    <CarouselContent>
                      {request.images.map((img: { public_id: string; url: string }) => (
                        <CarouselItem key={img.public_id} className="basis-1/3 sm:basis-1/4">
                          <Card className="py-0 px-0 border-0 shadow-none">
                            <CardContent className="flex h-24 relative items-center justify-center p-0">
                              <Image
                                src={img.url || '/assets/images/blogImg.jpg'}
                                alt="Service image"
                                fill
                                className="object-cover rounded-xl"
                                sizes="(max-width: 640px) 33vw, 25vw"
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-3 hover:bg-teal-500 hover:text-white" />
                    <CarouselNext className="-right-3 hover:bg-teal-500 hover:text-white" />
                  </Carousel>
                </div>
              )}

              {/* Accordion Sections */}
              <Section title="Service Overview" open={overView} onToggle={() => setOverview(!overView)}>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{request?.overview?.description || 'No overview provided.'}</p>
                <BookingTimeline request={request} />
              </Section>

              <Section title="Mode of Service" open={includes} onToggle={() => setIncludes(!includes)}>
                <div className="flex items-center gap-2.5 bg-gray-50 px-4 py-3 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{request?.mode || 'Not specified'}</span>
                </div>
              </Section>

              {request?.images?.length > 0 && (
                <Section title="Gallery" open={gallery} onToggle={() => setGallery(!gallery)}>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {request.images.slice(0, 6).map((img: { url: string; public_id: string }) => (
                      <div key={img.public_id} className="relative h-20 rounded-xl overflow-hidden bg-gray-100">
                        <Image src={img.url} fill className="object-cover" alt="Gallery" sizes="(max-width: 640px) 33vw, 100px" />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {request?.video?.url && (
                <Section title="Video" open={video} onToggle={() => setVideo(!video)}>
                  <video src={request.video.url} controls className="w-full rounded-xl max-h-64 bg-black" />
                </Section>
              )}
            </div>
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Reviews header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h5 className="text-base font-bold text-gray-900">Reviews</h5>
                <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {request?.reviews?.length ?? 0}
                </span>
              </div>
              {(() => {
                const myRating = request?.reviews?.find((r: Review) => r?.postedBy?._id === seeker?._id)?.rating;
                return myRating ? (
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-bold text-amber-700">{myRating}</span>
                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="px-5 py-5 flex flex-col gap-5">
              {/* Review form — only owner, completed, and not yet reviewed */}
              {isOwner && isCompleted && !alreadyReviewed && (
                <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Share your experience</p>
                      <p className="text-xs text-gray-500">Your feedback helps others find great Geeks.</p>
                    </div>
                  </div>
                  <ReviewInput serviceId={request._id} onSuccess={() => dispatch(getRequestById(requestId))} />
                </div>
              )}

              {/* Already reviewed */}
              {isOwner && isCompleted && alreadyReviewed && (
                <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-sm text-green-700 font-medium">You have already reviewed this service.</p>
                </div>
              )}

              {/* Not yet completed notice */}
              {isOwner && !isCompleted && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-amber-700">You can add a review once the service is marked as completed.</p>
                </div>
              )}

              {/* Reviews list */}
              {request?.reviews?.length > 0 ? (
                <div className="flex flex-col divide-y divide-gray-100">
                  {request.reviews.map((review: Review) => (
                    <div key={review._id} className="flex gap-3 py-4 first:pt-0">
                      <div className="flex-shrink-0">
                        <Image
                          className="rounded-full object-cover ring-2 ring-gray-100"
                          src={review?.postedBy?.profileImage?.url || '/assets/images/placeholder_user.jpg'}
                          width={38}
                          height={38}
                          alt="Reviewer"
                        />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-800">
                              {review?.postedBy?.fullName?.first} {review?.postedBy?.fullName?.last}
                            </span>
                            {review?.postedBy?._id === seeker?._id && (
                              <span className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full font-medium">You</span>
                            )}
                          </div>
                          {review?.rating && <StarRating rating={review.rating} />}
                        </div>
                        {review?.comment && (
                          <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-2 text-center">
                  <svg className="w-10 h-10 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <p className="text-sm text-gray-400">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-4 col-span-12 flex flex-col gap-4">
          {/* Geek / Service Provider Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Service Provider</h3>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center p-5 gap-3">
                <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden ring-4 ring-white shadow-md">
                  <Image
                    fill
                    className="object-cover"
                    src={request?.geek?.profileImage?.url || '/assets/images/placeholder_user.jpg'}
                    alt="Geek"
                    sizes="72px"
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <p className="font-bold text-gray-900">
                    {request?.geek?.fullName?.first} {request?.geek?.fullName?.last}
                  </p>
                  {request?.geek?.primarySkill?.title && (
                    <p className="text-xs text-gray-500">{request.geek.primarySkill.title}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'Email', value: request?.geek?.email || 'N/A' },
                  {
                    label: 'Phone',
                    value: isCompleted || request?.status === 'Accepted'
                      ? request?.geek?.mobile || 'N/A'
                      : '••••••••••',
                  },
                  {
                    label: 'Listings',
                    value: String(request?.geek?.requests?.length > 0 ? request.geek.requests.length : 1),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-gray-400 flex-shrink-0">{label}</span>
                    <span className="text-gray-800 text-right break-all">{value}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/geeks/${request?.geek?._id}`}
                className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Booking Details</h3>
            </div>
            <div className="p-5 flex flex-col gap-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-400 flex-shrink-0">Mode</span>
                <span className="text-gray-800 font-medium">{request?.mode || '—'}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-400 flex-shrink-0">Booked On</span>
                <span className="text-gray-800 text-right">{fmt(request?.createdAt) || '—'}</span>
              </div>
              {hasExplicitSlot(request) && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-gray-400 flex-shrink-0">Preferred Slot</span>
                  <span className="text-indigo-600 font-semibold text-right">{fmt(request?.scheduledAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleRequestPage;
