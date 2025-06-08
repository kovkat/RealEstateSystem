// client/src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import RatingSystem from '../components/RatingSystem';
import MapComponent from '../components/MapComponent';

// Мапа коду міста → назва українською
const cityDisplayNames = {
  kyiv: 'Київ',
  lviv: 'Львів',
  odesa: 'Одеса',
  kharkiv: 'Харків',
};

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFileNames, setSelectedFileNames] = useState('');

  // Функція для обробки сабміту форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const rating = formData.get('rating');
    const text = formData.get('text');

    // Проста валідація
    if (!name || !email || !rating || !text) {
      alert('Будь ласка, заповніть усі поля форми');
      return;
    }

    const files = form.querySelector('[name="fileUpload"]').files;

    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('rating', rating);
    payload.append('text', text);
    for (let i = 0; i < files.length; i++) {
      payload.append('files', files[i]);
    }

    try {
      const response = await fetch(`/api/properties/${id}/comments`, {
        method: 'POST',
        body: payload,
      });
      if (!response.ok) throw new Error('Помилка відправки коментаря');
      const newComment = await response.json();
      setProperty((prev) => ({
        ...prev,
        comments: [newComment, ...(prev?.comments || [])],
      }));
      form.reset();
      setSelectedFileNames('');
    } catch (err) {
      alert(err.message || 'Сталася помилка');
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getPropertyById(id);
        const comments = await api.getReviewsByPropertyId(id);
        setProperty({ ...data, comments });
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, [id]);

  if (error) {
    return (
      <p
        style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#dc2626',
          fontWeight: '600',
        }}
      >
        {error}
      </p>
    );
  }
  if (!property) {
    return (
      <p
        style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#374151',
        }}
      >
        Завантаження...
      </p>
    );
  }

  const comments = property.comments || [];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '2rem auto',
        background: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Заголовок */}
      <h1
        style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: '#7c3aed',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        {property.title}
      </h1>

      {/* Показуємо місто */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 500,
          color: '#4b5563',
          marginBottom: '1.5rem',
        }}
      >
        Місто: {cityDisplayNames[property.city] || property.city}
      </p>

      {/* Галерея */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
          maxWidth: '100%',
        }}
      >
        {property.images?.map((img, idx) => (
          <div
            key={idx}
            style={{
              flex: '0 0 auto',
              width: '100%',
              maxWidth: '24rem',
              height: '15rem',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <img
              src={img.url}
              alt={`Фото ${idx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
      </div>

      {/* Карта */}
      <div
        style={{
          marginBottom: '1.5rem',
          height: '16rem',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <MapComponent
          properties={[
            {
              longitude: property.longitude,
              latitude: property.latitude,
              title: property.title,
            },
          ]}
          city={property.city}
        />
      </div>

      {/* Основна інформація */}
      <div
        style={{
          background: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
          marginBottom: '1.5rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
            color: '#374151',
          }}
        >
          <div>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Ціна:</strong>
              <span
                style={{
                  marginLeft: '0.25rem',
                  fontSize: '1.5rem',
                  color: '#7c3aed',
                }}
              >
                {property.price.toLocaleString()} ₴
              </span>
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Площа:</strong> {property.area} м²
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Кімнат:</strong> {property.rooms}
            </p>
            <p>
              <strong>Місто:</strong> {cityDisplayNames[property.city] || property.city}
            </p>
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Адреса:</strong> {property.address}
            </p>
            <p>
              <strong>Джерело:</strong>{' '}
              <span style={{ fontWeight: 600, color: '#7c3aed' }}>
                {property.source === 'olx' ? 'OLX' : 'DOM.RIA'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Опис */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#7c3aed',
            marginBottom: '1rem',
          }}
        >
          Опис
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
          {property.description}
        </p>
      </div>

      {/* Рейтинг */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#eef2ff',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#7c3aed',
          }}
        >
          Рейтинг:
        </span>
        <RatingSystem rating={property.rating || 4} />
        <span style={{ marginLeft: '0.5rem', color: '#1f2937', fontWeight: 600 }}>
          {typeof property.rating === 'number' ? property.rating.toFixed(1) : '4.6'}/5
        </span>
      </div>

      {/* Ймовірність шахрайства */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#fef2f2',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#dc2626',
          }}
        >
          Ймовірність шахрайства:
        </span>
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#dc2626',
          }}
        >
          {typeof property.fraudProbability === 'number'
            ? `${(property.fraudProbability * 100).toFixed(0)}%`
            : '2%'}
        </span>
      </div>

      {/* Кнопка “Перейти на сторінку джерела” */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <a
          href={property.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
            color: 'white',
            fontWeight: 600,
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background 0.2s, transform 0.2s',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#6d28d9';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(to right, #8b5cf6, #7c3aed)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Перейти на сторінку джерела
        </a>
      </div>

      {/* Форма для додавання коментаря */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f3f4f6',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#7c3aed',
            marginBottom: '1rem',
            textAlign: 'center',
            width: '100%',
          }}
        >
          Залишити коментар
        </h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%',
            }}
          >
            <input
              name="name"
              type="text"
              placeholder="Ваше ім'я"
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <input
              name="email"
              type="email"
              placeholder="Електронна пошта"
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <select
              name="rating"
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Оцініть об’єкт</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </select>
            <textarea
              name="text"
              placeholder="Ваш коментар"
              rows="4"
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                width: '100%',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                background: '#ffffff',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files).map(f => f.name);
                  setSelectedFileNames(files.length ? files.join(', ') : '');
                }}
              />
              <label
                htmlFor="fileUpload"
                style={{
                  background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.2s',
                  fontSize: '0.9rem',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#6d28d9';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #8b5cf6, #7c3aed)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Вибрати файли
              </label>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedFileNames || 'Файли не вибрано'}
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.2s',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#6d28d9';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(to right, #8b5cf6, #7c3aed)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Відправити
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Розділ з наявними коментарями */}
      <div style={{ marginTop: '2rem' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#7c3aed',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Коментарі
        </h2>
        {comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                padding: '1rem',
                borderRadius: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                marginBottom: '1rem',
              }}
            >
              <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                {comment.user}
              </p>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                {comment.useremail}
              </p>
              <p style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
                {'⭐'.repeat(Math.round(comment.rating))}
              </p>
              <p style={{ color: '#374151' }}>{comment.text}</p>
              {comment.images?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {comment.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.image_url}
                      alt={`image-${i}`}
                      style={{
                        width: '100px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Ще немає коментарів до цього об’єкта.
          </p>
        )}
      </div>
    </div>
  );
}