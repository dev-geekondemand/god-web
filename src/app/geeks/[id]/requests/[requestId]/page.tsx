'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { getRequestById } from '@/features/request/requestSlice';
import { RootState } from '@/lib/store';
import MediaUploader from '@/app/components/UploadMedia';
import PageBanner from '@/app/components/PageBanner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Review, ServiceRequest } from '@/interfaces/ServiceRequest';
import { useSelector } from 'react-redux';
import Geek from '@/interfaces/Geek';

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  Matched:   { label: 'Matched',   className: 'bg-teal-50 text-teal-700 border border-teal-200' },
  Accepted:  { label: 'Accepted',  className: 'bg-green-50 text-green-700 border border-green-200' },
  Completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border border-green-200' },
  Rejected:  { label: 'Rejected',  className: 'bg-red-50 text-red-700 border border-red-200' },
  Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border border-red-200' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-500 border border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Completed' || status === 'Accepted' ? 'bg-green-500' : status === 'Pending' ? 'bg-amber-500' : status === 'Matched' ? 'bg-teal-500' : 'bg-red-500'}`} />
      {config.label}
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
          {/* Track */}
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step.icon}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${step.done ? 'bg-teal-200' : 'bg-gray-100'}`} />
            )}
          </div>
          {/* Content */}
          <div className={`pb-4 min-w-0 ${i === steps.length - 1 ? '' : ''}`}>
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
  const geekId = useParams()?.id as string;
  const dispatch = useAppDispatch();

  const [overView, setOverview] = useState(true);
  const [includes, setIncludes] = useState(true);
  const [gallery, setGallery] = useState(true);
  const [uploadedMedia, setUploadedMedia] = useState(false);

  const curGeek = useSelector((state: RootState) => state.geek?.geek) as Geek;

  useEffect(() => {
    dispatch(getRequestById(requestId));
  }, [dispatch, requestId]);

  const request = useAppSelector((state: RootState) => state.request?.request) as ServiceRequest;

  const canComplete = curGeek?._id === request?.geek?._id &&
    request?.status !== 'Completed' &&
    request?.status !== 'Matched' &&
    request?.status !== 'Cancelled' &&
    request?.status !== 'Rejected';

  return (
    <section className="w-full h-full relative flex flex-col items-center justify-center gap-5">
      {/* Media Upload Modal */}
      <div hidden={!uploadedMedia} onClick={() => setUploadedMedia(false)} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50" />
      {uploadedMedia && (
        <div className="fixed top-12 bottom-12 left-4 right-4 z-50 max-w-xl mx-auto overflow-y-auto bg-white shadow-2xl rounded-2xl">
          <MediaUploader requestId={requestId} isUploadedOpen={uploadedMedia} setIsUploadedOpen={setUploadedMedia} onSuccess={() => dispatch(getRequestById(requestId))} />
        </div>
      )}

      <PageBanner
        title={request?.category?.title || 'Request Detail'}
        crumbs={[
          { label: 'Service Requests', href: `/geeks/${geekId}/requests` },
          { label: request?.category?.title || 'Request Detail' },
        ]}
      />

      <div className="grid py-8 grid-cols-12 gap-6 w-full max-w-7xl mx-auto px-4 pb-16">
        {/* Left Column */}
        <div className="md:col-span-8 col-span-12 flex flex-col gap-5">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Hero Image */}
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
                {request?.reviews?.[0]?.rating && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{request.reviews[0].rating}</span>
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
            </div>
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h5 className="text-base font-bold text-gray-900">
                Reviews <span className="text-gray-400 font-normal text-sm ml-1">({request?.reviews?.length ?? 0})</span>
              </h5>
              {request?.reviews?.[0]?.rating && (
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-bold text-amber-700">{request.reviews[0].rating}</span>
                  <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              )}
            </div>

            {request?.reviews?.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {request.reviews.map((review: Review) => (
                  <div key={review._id} className="flex gap-3 py-4 first:pt-0">
                    <div className="flex-shrink-0">
                      <Image
                        className="rounded-full object-cover ring-2 ring-gray-100"
                        src={review?.postedBy?.profileImage?.url || '/assets/images/placeholder_user.jpg'}
                        width={36}
                        height={36}
                        alt="Reviewer"
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-gray-800">
                          {review?.postedBy?.fullName?.first} {review?.postedBy?.fullName?.last}
                        </span>
                        {review?.rating && <StarRating rating={review.rating} />}
                      </div>
                      {review?.comment && <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 gap-2 text-center">
                <svg className="w-10 h-10 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <p className="text-sm text-gray-400">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-4 col-span-12 flex flex-col gap-4">
          {/* Seeker Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Seeker Details</h3>
            </div>
            {request?.seeker?._id ? (
              <div className="p-5 flex flex-col gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center p-5 gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                    <img
                      src={request.seeker.profileImage || '/assets/images/placeholder_user.jpg'}
                      alt="Seeker"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-bold text-gray-900 text-center">
                    {request.seeker.fullName?.first} {request.seeker.fullName?.last}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Email', value: request.seeker.email || 'N/A' },
                    { label: 'Phone', value: request.seeker.phone || 'N/A' },
                    {
                      label: 'Location',
                      value: request.seeker.address?.city && request.seeker.address?.state
                        ? `${request.seeker.address.city}, ${request.seeker.address.state}`
                        : 'N/A',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-gray-400 flex-shrink-0">{label}</span>
                      <span className="text-gray-800 text-right break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-center text-gray-400 py-8">Seeker information unavailable.</p>
            )}
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
              {request?.brand?.name && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-gray-400 flex-shrink-0">Brand</span>
                  <span className="text-gray-800 font-medium text-right">{request.brand.name}</span>
                </div>
              )}
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

          {/* Complete Request CTA */}
          {canComplete && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Mark as Complete</h4>
                <p className="text-xs text-gray-400 mt-0.5">Upload proof of work to complete this request.</p>
              </div>
              <button
                onClick={() => setUploadedMedia(true)}
                className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold text-sm rounded-xl px-4 py-3 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-teal-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload & Complete
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleRequestPage;
