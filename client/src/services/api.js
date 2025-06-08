// client/src/services/api.js
const BASE_URL = '/api/properties';

async function getAllProperties() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Не вдалося завантажити список оголошень');
    return await res.json();
}

async function getPropertyById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Не вдалося завантажити дані оголошення');
    return await res.json();
}

async function getReviewsByPropertyId(id) {
    const res = await fetch(`/api/properties/${id}/comments`);
    if (!res.ok) throw new Error('Не вдалося завантажити коментарі');
    return await res.json();
}

export default { getAllProperties, getPropertyById, getReviewsByPropertyId };