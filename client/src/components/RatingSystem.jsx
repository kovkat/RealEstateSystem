import React from 'react';

export default function RatingSystem({ rating }) {
  // Only render the stars themselves:
  return (
    <div>
      {'⭐'.repeat(Math.round(rating))}
    </div>
  );
}