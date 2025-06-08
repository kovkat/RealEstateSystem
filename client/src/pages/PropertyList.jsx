import React, { useState } from 'react';
import useRealEstate from '../hooks/useRealEstate';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import MapComponent from '../components/MapComponent';

export default function PropertyList() {
  const { properties, loading, filters, updateFilters } = useRealEstate();
  const [searchFilters, setSearchFilters] = useState({});
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleFilterChange = (changed) => {
    setSearchFilters((prev) => ({
      ...prev,
      ...changed,
    }));
  };

  const handleSearch = () => {
    updateFilters(searchFilters);
    setSearchTriggered(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10">
      <FilterPanel filters={searchFilters} onChange={handleFilterChange} />
      <button
        className="search-button"
        style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}
        onClick={handleSearch}
      >
        Пошук
      </button>

      {loading && searchTriggered ? (
        <p className="text-center text-gray-700">Завантаження...</p>
      ) : (
        <>
          {searchTriggered && (
            <>
              <MapComponent properties={properties} city={searchFilters.city} />

              <div className="property-grid">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}