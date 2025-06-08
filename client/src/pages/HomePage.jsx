import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-hero">
      <div className="home-content">
        <h1 className="home-title">Пошук нерухомості</h1>
        <Link to="/properties" className="home-button">
          Переглянути всі оголошення
        </Link>
      </div>
    </div>
  );
}