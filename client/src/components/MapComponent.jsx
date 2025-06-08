import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Ваш access token Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoia292a2F0MjUiLCJhIjoiY21iYXNlYXoyMHpieTJxc2NxZzJrN2N3cSJ9.92mRhOoUWEBZH_gL7ghAMQ';

export default function MapComponent({ properties, city }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Словник координат для основних міст
    const cityCoordinates = {
      kyiv: [30.5234, 50.4501],
      lviv: [24.0297, 49.8397],
      odesa: [30.7326, 46.4825],
      kharkiv: [36.2314, 49.9929],
      // Можна додати ще
    };

    // Якщо користувач вибрав місто, беремо його координати
    let initialCenter;
    if (city && cityCoordinates[city]) {
      initialCenter = cityCoordinates[city];
    } else {
      // Шукаємо першу нерухомість із валідними координатами
      const firstValid = properties.find(
        (p) => !isNaN(Number(p.longitude)) && !isNaN(Number(p.latitude))
      );
      if (firstValid) {
        initialCenter = [
          Number(firstValid.longitude),
          Number(firstValid.latitude),
        ];
      } else {
        // Якщо нічого не знайдено, дефолт — Київ
        initialCenter = cityCoordinates['kyiv'];
      }
    }

    // Ініціалізація карти
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCenter,
      zoom: 12,
    });

    // Додаємо маркери всіх властивостей, які мають коректні координати
    let hasValidMarker = false;
    properties.forEach((property) => {
      const lng = Number(property.longitude);
      const lat = Number(property.latitude);
      if (!isNaN(lng) && !isNaN(lat)) {
        hasValidMarker = true;
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(property.title))
          .addTo(map);
      }
    });

    // Якщо не було жодного валідного маркера, ставимо маркер у центрі міста
    if (!hasValidMarker) {
      // Підпис для попапу: назва міста українською
      const cityNames = {
        kyiv: 'Київ',
        lviv: 'Львів',
        odesa: 'Одеса',
        kharkiv: 'Харків',
      };
      let popupCity;
      if (city && cityNames[city]) {
        popupCity = cityNames[city];
      } else {
        popupCity = 'Київ';
      }
      new mapboxgl.Marker()
        .setLngLat(initialCenter)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(popupCity))
        .addTo(map);
    }

    // Видаляємо карту при розмонтовуванні компонента
    return () => map.remove();
  }, [properties, city]);

  return (
    <div
      className="map-container"
      ref={mapContainerRef}
      style={{ height: '400px', width: '100%', marginBottom: '2rem', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 18px rgba(2, 132, 199, 0.10)' }}
    />
  );
}