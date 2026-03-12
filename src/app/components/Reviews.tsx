"use client"
import { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import { X } from 'lucide-react'

const TOTAL = 8

const Reviews = () => {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className='flex justify-center w-full pt-12'>
      <div className='max-w-7xl w-full flex flex-col justify-center items-center rounded-md'>
        <div className='flex flex-col max-w-2xl items-center justify-center w-full mx-auto gap-3'>
          <h1 className="h3 text-center">Voices of Our <span className='colored'>Seekers</span></h1>
          <p className="body-2 text-gray-700 text-center">Real stories from people who found quick, reliable IT tech Support with GeekOnDemand.</p>
        </div>

        <Carousel
          opts={{ align: "start" }}
          className="w-full py-12 relative"
        >
          <CarouselContent>
            {Array.from({ length: TOTAL }, (_, i) => (
              <CarouselItem key={i} className="md:basis-1/3 sm:basis-1/2 lg:basis-1/4 h-72">
                <button
                  onClick={() => setSelected(i + 1)}
                  className="w-full h-full rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-teal-500 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <Image
                    src={`/assets/testimonials/${i + 1}.jpeg`}
                    width={500}
                    height={500}
                    alt={`Testimonial ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='cursor-pointer -left-3 hover:bg-teal-500 hover:text-white' />
          <CarouselNext className='cursor-pointer -right-3 hover:bg-teal-500 hover:text-white' />
        </Carousel>
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <Image
              src={`/assets/testimonials/${selected}.jpeg`}
              width={1000}
              height={1200}
              alt={`Testimonial ${selected}`}
              className="w-full h-auto object-contain"
              quality={100}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default Reviews
