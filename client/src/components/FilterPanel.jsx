// client/src/components/FilterPanel.jsx
import React from 'react';

const FilterPanel = ({ filters, onChange }) => {
  return (
    <section className="w-full flex flex-col items-center mb-6">
      <div className="filter-panel">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 uppercase tracking-wide shadow-sm">Фільтри</h2>
        <div className="filter-group">
          {/* Ціна */}
          <div>
            <label className="filter-label">Ціна до (₴)</label>
            <input
              type="number"
              value={filters.price || ''}
              onChange={(e) => onChange({ price: e.target.value })}
              className="filter-input"
              min="0"
            />
          </div>

          {/* Кількість кімнат */}
          <div>
            <label className="filter-label">Кімнат</label>
            <input
              type="number"
              value={filters.rooms || ''}
              onChange={(e) => onChange({ rooms: e.target.value })}
              className="filter-input"
              min="1"
            />
          </div>

          {/* Площа */}
          <div>
            <label className="filter-label">Мін. площа (м²)</label>
            <input
              type="number"
              value={filters.area || ''}
              onChange={(e) => onChange({ area: e.target.value })}
              className="filter-input"
              min="0"
            />
          </div>

          {/* Тип нерухомості */}
          <div>
            <label className="filter-label">Тип</label>
            <select
              value={filters.type || ''}
              onChange={(e) => onChange({ type: e.target.value })}
              className="filter-select"
            >
              <option value="">Виберіть тип</option>
              <option value="apartment">Квартира</option>
              <option value="house">Будинок</option>
              <option value="room">Кімната</option>
            </select>
          </div>

          {/* Місто */}
          <div>
            <label className="filter-label">Місто</label>
            <select
              value={filters.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              className="filter-select"
            >
              <option value="">Виберіть місто</option>
              <option value="kyiv">Київ</option>
              <option value="lviv">Львів</option>
              <option value="odesa">Одеса</option>
              <option value="kharkiv">Харків</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;