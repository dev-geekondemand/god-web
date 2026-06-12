import Image from 'next/image'
import Link from 'next/link'
import PageBanner from '../components/PageBanner'

const Models = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <PageBanner title="Login" crumbs={[{ label: 'Login' }]} />

      <div className='flex flex-wrap justify-center max-w-6xl items-center gap-8 p-5 h-[80vh]'>
        <Link
          href="/login/seeker"
          className="max-w-xs px-10 py-8 rounded-lg relative bg-white hover:scale-105 transition transform duration-300 shadow-lg border cursor-pointer border-gray-400/50"
        >
          <div className='w-full h-full rounded-lg flex flex-col items-center justify-center'>
            <h3 className='text-xl font-bold mb-4'>Login as a Seeker</h3>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <Image width={180} height={150} className="rounded-lg" src="/assets/images/login-seeker.png" alt="Seeker Login" />
          </div>
        </Link>

        <Link
          href="/login/geek"
          className="max-w-xs px-10 py-8 rounded-lg relative bg-white hover:scale-105 transition transform duration-300 shadow-lg border cursor-pointer border-gray-400/50"
        >
          <div className='w-full h-full rounded-lg flex flex-col items-center justify-center'>
            <h3 className='text-xl font-bold mb-4'>Login as a Geek</h3>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <Image width={180} height={150} className="rounded-lg" src="/assets/images/geek-login.png" alt="Geek Login" />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Models
