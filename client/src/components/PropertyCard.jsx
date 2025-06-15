import React from 'react';
import { Link } from 'react-router-dom';

const cityDisplayNames = {
  kyiv: 'Київ',
  lviv: 'Львів',
  odesa: 'Одеса',
  kharkiv: 'Харків',
};

export default function PropertyCard({ property }) {
  const isSuspicious = property.fraudProbability > 0.7 || !property.images || property.images.length === 0;

  return (
    <div className="property-card-outer" style={{ padding: '0.5rem' }}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '24rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          border: isSuspicious ? '2px solid #f43f5e' : '2px solid transparent',
          transition: 'box-shadow 0.5s, border 0.3s',
        }}
      >
        {property.images?.length > 0 && (
          <img
            src={property.images[0].url}
            alt={property.title}
            style={{
              borderRadius: '0.75rem',
              marginBottom: '1rem',
              objectFit: 'cover',
              height: '12rem',
              width: '100%',
              display: 'block',
            }}
          />
        )}

        {isSuspicious && (
          <span
            style={{
              display: 'inline-block',
              background: '#f43f5e',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem',
            }}
          >
            Увага!
          </span>
        )}

        <h2
          style={{
            color: '#7c3aed',
            fontSize: '1.25rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.5rem',
          }}
        >
          {property.title}
        </h2>

        <p
          style={{
            color: '#111827',
            marginBottom: '0.5rem',
            fontWeight: 600,
            fontSize: '1.125rem',
          }}
        >
          Ціна: {property.price.toLocaleString()} ₴
        </p>

        {property.rooms && (
          <p style={{ color: '#374151', marginBottom: '0.25rem' }}>Кімнат: {property.rooms}</p>
        )}
        {property.area && (
          <p style={{ color: '#374151', marginBottom: '1rem' }}>Площа: {property.area} м²</p>
        )}
        {property.city && (
          <p style={{ color: '#374151', marginBottom: '0.25rem' }}>
            Місто: {cityDisplayNames[property.city] || property.city}
          </p>
        )}

        <p
          style={{
            color: '#4b5563',
            marginBottom: '1rem',
            fontStyle: 'italic',
            fontSize: '0.875rem',
          }}
        >
          Джерело: {property.source === 'dom.ria' ? 'DOM.RIA' : 'OLX'}
        </p>

        <Link
          to={`/properties/${property.id}`}
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.5rem 1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px 0 rgba(139,92,246,0.25)',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 8px 24px 0 rgba(139,92,246,0.35)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background =
              'linear-gradient(to right, #6d28d9, #5b21b6)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(139,92,246,0.25)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background =
              'linear-gradient(to right, #8b5cf6, #7c3aed)';
          }}
        >
          🔍 Деталі
        </Link>
      </div>
    </div>
  );
}
