"use client"
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Stars from "./Stars"
import Image from 'next/image'

const reviews = [
    {
        stars:4,
        userName:"Abhay Pratap",
        comment:"I am happpy with service provided.",
        date:"29 August 2024",
        heading:"Good Work"
    },
    {
        stars:3.5,
        userName:"Pratap Singh",
        comment:"I am happpy with service provided by the Geek. He was polite and knew what to do.",
        date:"29 January 2025",
        heading:"Satisfied"
    },
    {
        stars:5,
        userName:"Abhay Yadav",
        comment:"The Geek was very knowledgable and fixed the problem very easily.",
        date:"29 August 2024",
        heading:"Quick and Easy"
    },
    {
        stars:2.5,
        userName:"Abhay Pratap",
        comment:"Average experience, Geek took too much time to do little work.",
        date:"11 February 2024",
        heading:"Average Experience"
    },
]

const Reviews = () => {
  return (
    <section className='flex justify-center w-full py-12'>
    <div className='max-w-7xl w-full flex flex-col justify-center items-center rounded-md'>
          <div className='flex flex-col max-w-2xl items-center justify-center w-full mx-auto gap-3'>
            <h1 className="h3 text-center">Voices of Our <span className='colored'>Seekers</span></h1>
              <p className="body-2 text-gray-700 text-center">Real stories from people who found quick, reliable IT tech Support with GeekOnDemand.</p>
          </div>
          
          <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full py-12 relative"
                >
                <CarouselContent>
                    {reviews.map((review,index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
                        <Card className='bg-white border border-gray-200 rounded-md h-full'>
                            <CardContent className="flex flex-col gap-2 items-start justify-start">
                            <Stars initialRating={review.stars} />
                            <div className='flex flex-col gap-2'>
                                <h6 className="h5 text-gray-800">{review.heading}</h6>
                                <p className="body-2 text-gray-700">{review.comment}</p>
                            </div>
                            <div className='flex w-full justify-between items-center pt-3'>
                               <div className='flex gap-2 items-center'>
                               <div className='w-12 h-12 border flex gap-2 relative border-black rounded-full'>
                                    <Image objectFit='cover' className='rounded-full' src={"/assets/images/jobs/laptop-repair.webp"} alt="user Image" layout='fill'  />
                                   
                                </div>
                                <p className="font-bold">{review.userName}</p>
                               </div>

                                <p className='text-sm'>{review.date}</p>

                            </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='cursor-pointer -left-3 hover:bg-teal-500 hover:text-white'/>
                <CarouselNext className='cursor-pointer -right-3 hover:bg-teal-500 hover:text-white' />
            </Carousel>
      </div>
    </section>
  )
}

export default Reviews
