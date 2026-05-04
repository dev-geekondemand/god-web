"use client"
// import ServiceCard from '@/app/components/ServiceCard'
import { categories } from '@/utils/categories'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import PageBanner from '@/app/components/PageBanner'

const Service = () => {

    const slug = usePathname().split("/")[2];

    const curCategory = categories.find((category) => category.urlpath === slug);

    const router = useRouter();
    

  return (
    <section className='w-full flex flex-col justify-center items-center'>
        <PageBanner
          title={curCategory?.category_name || 'Service Category'}
          crumbs={[
            { label: 'Service Categories', href: '/service-categories' },
            { label: curCategory?.category_name || 'Service Category' },
          ]}
        />

        <div className='w-full justify-center flex py-20 px-3'>
            <div className='max-w-6xl mx-auto flex flex-col gap-12 justify-center w-full'>
            {/* <ServiceCard  col={12 } />
            <ServiceCard  col={12 } />
            <ServiceCard  col={12 } /> */}
            </div>

        </div>
    </section>
  )
}

export default Service
