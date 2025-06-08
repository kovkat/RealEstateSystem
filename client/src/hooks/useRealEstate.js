// client/src/hooks/useRealEstate.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useRealEstate() {
    const [allProperties, setAllProperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await api.getAllProperties();
                setAllProperties(data);
                setProperties(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
        setLoading(true);

        let filtered = allProperties;

        if (newFilters.price) {
            filtered = filtered.filter(p => p.price <= parseInt(newFilters.price, 10));
        }
        if (newFilters.rooms) {
            filtered = filtered.filter(p => p.rooms >= parseInt(newFilters.rooms, 10));
        }
        if (newFilters.area) {
            filtered = filtered.filter(p => p.area >= parseInt(newFilters.area, 10));
        }
        if (newFilters.type) {
            filtered = filtered.filter(p => p.type === newFilters.type);
        }
        if (newFilters.city) {
            filtered = filtered.filter(
                p => p.city && p.city.toLowerCase() === newFilters.city.toLowerCase()
            );
        }
        if (newFilters.rating) {
            filtered = filtered.filter(p => p.rating >= parseFloat(newFilters.rating));
        }

        setProperties(filtered);
        setLoading(false);
    };

    return { properties, loading, filters, updateFilters };
}