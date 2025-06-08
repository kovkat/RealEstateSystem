import { Review, ReviewImage } from '../models/Review.js';
import { Property } from '../models/Property.js';

export async function getReviews(req, res) {
    try {
        const reviews = await Review.findAll({
            where: { property_id: req.params.id },
            include: [{ model: ReviewImage, as: 'images' }]
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function createReview(req, res) {
    try {
        const { name, email, rating, text } = req.body;
        const propertyId = req.params.id;
        const files = req.files || [];

        const review = await Review.create({
            property_id: propertyId,
            user: name,
            useremail: email,
            rating: parseFloat(rating),
            text
        });

        for (const file of files) {
            await ReviewImage.create({
                review_id: review.id,
                image_url: `/uploads/${file.filename}`
            });
        }

        const fullReview = await Review.findByPk(review.id, {
            include: [{ model: ReviewImage, as: 'images' }]
        });

        // Після створення відгуку — оновлюємо середній рейтинг нерухомості
        const allRatings = await Review.findAll({
            where: { property_id: propertyId },
            attributes: ['rating']
        });

        const sum = allRatings.reduce((acc, r) => acc + parseFloat(r.rating), 0);
        const avg = parseFloat((sum / allRatings.length).toFixed(2));

        await Property.update({ rating: avg }, { where: { id: propertyId } });

        res.status(201).json(fullReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}