import React from 'react';

export default function RatingSystem({ rating }) {
  return (
    <div>
      {'⭐'.repeat(Math.round(rating))}
    </div>
  );
}
