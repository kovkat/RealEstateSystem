// server/controllers/propertyController.js
import { Property, PropertyImage } from '../models/Property.js';

export async function getAll(req, res) {
    try {
        const properties = await Property.findAll({
            include: [{ model: PropertyImage, as: 'images' }],
            order: [
                ['rating', 'DESC']
            ],
        });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getById(req, res) {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [{ model: PropertyImage, as: 'images' }]
        });
        if (!property) {
            return res.status(404).json({ error: 'Оголошення не знайдено' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}