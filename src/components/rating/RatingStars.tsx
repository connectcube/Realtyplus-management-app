import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

const RatingStars = ({
  rating,
  maxRating = 5,
  size = 20,
  onRatingChange,
  readOnly = false,
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const getStarColor = (index: number) => {
    const currentRating = hoverRating || rating;
    if (index <= currentRating) {
      return "text-yellow-400 fill-yellow-400";
    }
    return "text-gray-300";
  };

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((index) => (
        <Star
          key={index}
          size={size}
          className={`${getStarColor(index)} ${!readOnly ? "cursor-pointer" : ""}`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default RatingStars;
