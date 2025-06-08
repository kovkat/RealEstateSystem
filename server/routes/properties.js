// server/routes/properties.js
import express from 'express';
import { getAll, getById } from '../controllers/propertyController.js';
import multer from 'multer';
import { createReview, getReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
const upload = multer({ dest: 'uploads/' });

router.get('/:id/comments', getReviews);
router.post('/:id/comments', upload.array('files'), createReview);

export default router;