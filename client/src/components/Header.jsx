import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <Link to="/" className="logo">
        🏠 RealEstatePro
      </Link>

      <button className="burger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
      </button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Головна</Link>
        <Link to="/properties" onClick={() => setMenuOpen(false)}>Нерухомість</Link>
      </nav>
    </header>
  );
}