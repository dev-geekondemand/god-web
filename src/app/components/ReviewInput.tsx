import { addSeekerReview } from '@/features/request/requestSlice';
import { useAppDispatch } from '@/lib/hooks';
import { Star } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'





const ReviewInput = ({serviceId}:{serviceId:string}) => {

    console.log(serviceId);
    

    const [text, setText] = useState('');
    const [hovered, setHovered] = useState<number | null>(null);

    const [rating, setRating] = useState(0);

    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useAppDispatch();

    const handleChange = (stars: number) => {
        setRating(stars);
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    useEffect(()=>{
        if(rating !== 0){
            setErrorMessage('');
        }
    },[rating])

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if( rating === 0){
            setErrorMessage('Please select a rating');
            return
        }

        const obj = {
            id: serviceId,
            data: {
                rating,
                comment: text
            }
        }
        
        dispatch(addSeekerReview(obj)).then(()=>{
            setText('');
            setRating(0);
            setHovered(0);
        });
    }

    
  return (
    <div className='w-full flex flex-col relative px-3'>

      <div className='flex flex-row-reverse gap-3 items-center'>
         <div className="flex space-x-1 justify-end mb-2">
        {[1, 2, 3, 4, 5].map((star) => {

            const isActive = (hovered ?? rating) >= star;
            return (
            <div
                key={star}
                className="cursor-pointer w-6 h-6"
                onClick={() => handleChange(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
            >
                {isActive ? (
                <Image
                    src="/assets/icons/star.png"
                    alt={`star-${star}`}
                    width={24}
                    height={24}
                    className="w-full h-full"
                />
                ) : (
                <Star
                    className="w-full h-full text-gray-300"
                />
                )}
            </div>
            );
        })}
        </div>

      <input type="text"
      name='review'
      id='review'
      value={text}
      onChange={onChange}
    
      placeholder='Enter your review'
      className='w-full border-b-2 bg-gray-50 outline-none px-3 py-2 focus:bg-white focus:border-teal-500 text-gray-700 border-teal-300 p-2'
      />

      </div>
      {errorMessage !== '' && <p className='text-red-500 text-xs mt-1'>{errorMessage}</p>}

      <button type='submit' onClick={handleSubmit} className='px-3 py-1.5 text-xs font-semibold text-white w-fit rounded-lg mt-3 mx-2 bg-teal-500'>Add Review</button>
    </div>
  )
}

export default ReviewInput
