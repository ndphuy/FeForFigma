import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ 
  rating = 5, 
  onRatingChange = () => {}, 
  interactive = true, 
  size = "md",
  showValue = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const currentScore = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange(star)}
            className={`transition-transform duration-100 ${interactive ? 'hover:scale-125 focus:outline-none' : 'cursor-default'}`}
          >
            <Star
              className={`${starSizes[size]} ${
                star <= currentScore
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200 fill-slate-100'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-bold text-slate-700 ml-1">
          {currentScore.toFixed(1)}
        </span>
      )}
    </div>
  );
};
