import { addSeekerReview } from '@/features/request/requestSlice';
import { useAppDispatch } from '@/lib/hooks';
import React, { useEffect, useState } from 'react';

const ReviewInput = ({ serviceId, onSuccess }: { serviceId: string; onSuccess?: () => void }) => {
  const [text, setText] = useState('');
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (rating !== 0) setErrorMessage('');
  }, [rating]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (rating === 0) {
      setErrorMessage('Please select a rating before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(addSeekerReview({ id: serviceId, data: { rating, comment: text } }));
      setText('');
      setRating(0);
      setHovered(null);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const activeRating = hovered ?? rating;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Star Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Your Rating</label>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = activeRating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-8 h-8 transition-transform hover:scale-110 focus:outline-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isActive ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`w-full h-full transition-colors ${isActive ? 'text-amber-400' : 'text-gray-300'}`}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              );
            })}
          </div>
          {activeRating > 0 && (
            <span className="text-sm font-medium text-amber-600">{labels[activeRating - 1]}</span>
          )}
        </div>
        {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Your Review <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share details about your experience with this service..."
          rows={3}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="self-start flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Submit Review
          </>
        )}
      </button>
    </div>
  );
};

export default ReviewInput;
