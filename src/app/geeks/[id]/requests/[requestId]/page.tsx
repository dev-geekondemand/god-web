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
import { SubCategory } from '@/interfaces/Category';
import { Review, ServiceRequest } from '@/interfaces/ServiceRequest';
import { useSelector } from 'react-redux';
import Geek from '@/interfaces/Geek';

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    Matched: 'bg-teal-100 text-teal-700 border border-teal-200',
    Accepted: 'bg-green-100 text-green-700 border border-green-200',
    Completed: 'bg-green-100 text-green-700 border border-green-200',
    Rejected: 'bg-red-100 text-red-700 border border-red-200',
    Cancelled: 'bg-red-100 text-red-700 border border-red-200',
  };
  return styles[status] || 'bg-gray-100 text-gray-500 border border-gray-200';
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
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
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

  const azureLoader = ({ src }: { src: string }) => src;
  const request = useAppSelector((state: RootState) => state.request?.request) as ServiceRequest;

  return (
    <section className="w-full h-full relative flex flex-col items-center justify-center gap-5">
      {/* Media Upload Modal */}
      <div
        hidden={!uploadedMedia}
        onClick={() => setUploadedMedia(false)}
        className="fixed inset-0 bg-gray-900/50 z-50"
      />
      {uploadedMedia && (
        <div className="fixed top-12 bottom-12 left-4 right-4 z-50 max-w-3xl mx-auto overflow-y-auto bg-white shadow-xl rounded-xl">
          <MediaUploader requestId={requestId} isUploadedOpen={uploadedMedia} setIsUploadedOpen={setUploadedMedia} />
        </div>
      )}

      <PageBanner
        title={request?.category?.title || 'Request Detail'}
        crumbs={[
          { label: 'Service Requests', href: `/geeks/${geekId}/requests` },
          { label: request?.category?.title || 'Request Detail' },
        ]}
      />

      {/* Main Content */}
      <div className="grid py-10 grid-cols-12 gap-6 w-full max-w-7xl mx-auto px-4 pb-16">
        {/* Left Column */}
        <div className="md:col-span-8 col-span-12 flex flex-col gap-6">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-6 w-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold text-gray-900">{request?.category?.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {(request?.address?.city || request?.geek?.address?.city) && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {request?.address
                        ? `${request.address.city}, ${request.address.state}`
                        : `${request?.geek?.address?.city}, ${request?.geek?.address?.state}`}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Image src="/assets/icons/star.svg" alt="Star" width={13} height={13} />
                    {request?.totalRating} ({request?.reviews?.length ?? 0} Reviews)
                  </span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusBadge(request?.status)}`}>
                {request?.status}
              </span>
            </div>

            {/* Hero Image */}
            <div className="w-full h-64 sm:h-80 relative rounded-xl overflow-hidden bg-gray-100">
              <Image
                loader={azureLoader}
                src={request?.category?.image?.url || '/assets/images/blogImg.jpg'}
                alt={request?.category?.title || 'Service'}
                layout="fill"
                className="object-cover"
              />
            </div>

            {/* Uploaded Images Carousel */}
            {request?.images?.length > 0 && (
              <Carousel opts={{ align: 'start' }} className="w-full">
                <CarouselContent>
                  {request.images.map((img: { public_id: string; url: string }) => (
                    <CarouselItem key={img.public_id} className="basis-1/3 sm:basis-1/4">
                      <Card className="py-0 px-0 border-0 shadow-none">
                        <CardContent className="flex h-24 relative items-center justify-center p-0">
                          <Image
                            loader={azureLoader}
                            src={img.url || '/assets/images/blogImg.jpg'}
                            alt="Service image"
                            layout="fill"
                            className="object-cover rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-3 hover:bg-teal-500 hover:text-white" />
                <CarouselNext className="-right-3 hover:bg-teal-500 hover:text-white" />
              </Carousel>
            )}

            {/* Accordion Sections */}
            <Section title="Service Overview" open={overView} onToggle={() => setOverview(!overView)}>
              <p className="text-gray-500 text-sm leading-relaxed">{request?.overview?.description || 'No overview provided.'}</p>
              {request?.category?.subCategories?.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.category.subCategories.map((subCat: SubCategory) => (
                      <span key={subCat._id} className="bg-white border border-gray-100 shadow-sm text-sm text-gray-700 px-3 py-1.5 rounded-lg">
                        {subCat.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            <Section title="Mode of Service" open={includes} onToggle={() => setIncludes(!includes)}>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-gray-700 text-sm font-medium">{request?.mode || 'Not specified'}</span>
              </div>
            </Section>

            {request?.images?.length > 0 && (
              <Section title="Gallery" open={gallery} onToggle={() => setGallery(!gallery)}>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {request.images.slice(0, 6).map((img: { url: string; public_id: string }) => (
                    <div key={img.public_id} className="relative h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image loader={azureLoader} src={img.url} layout="fill" className="object-cover" alt="Gallery" />
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-6 w-full flex flex-col gap-4">
            <h5 className="text-xl font-bold text-gray-900">
              Reviews <span className="text-gray-400 font-normal text-base">({request?.reviews?.length ?? 0})</span>
            </h5>

            {request?.reviews?.length > 0 ? (
              <div className="flex flex-col gap-1 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {request.reviews.map((review: Review) => (
                  <div key={review._id} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0">
                      <Image
                        loader={azureLoader}
                        className="rounded-full object-cover"
                        src={review?.postedBy?.profileImage?.url || '/assets/images/placeholder_user.jpg'}
                        width={32}
                        height={32}
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
                      <p className="text-sm text-gray-500">{review?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-4 col-span-12 flex flex-col gap-5">
          {/* Seeker Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-5 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">Seeker Details</h3>
            {request?.seeker?._id ? (
              <>
                <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center p-4 gap-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white shadow">
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
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-gray-400 flex-shrink-0">Email</span>
                    <span className="text-gray-800 text-right break-all">{request.seeker.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-400 flex-shrink-0">Phone</span>
                    <span className="text-gray-800">{request.seeker.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-gray-400 flex-shrink-0">Address</span>
                    <span className="text-gray-800 text-right">
                      {request.seeker.address?.city && request.seeker.address?.state
                        ? `${request.seeker.address.city}, ${request.seeker.address.state}`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-center text-gray-400">Seeker information unavailable.</p>
            )}
          </div>

          {/* Complete Request CTA */}
          {curGeek?._id === request?.geek?._id &&
            request?.status !== 'Completed' &&
            request?.status !== 'Matched' &&
            request?.status !== 'Cancelled' &&
            request?.status !== 'Rejected' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
                <button
                  onClick={() => setUploadedMedia(true)}
                  className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Complete Request
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default SingleRequestPage;
