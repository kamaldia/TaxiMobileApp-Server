import express from 'express';
import * as Review from '../Controllers/review.js';

const router = express.Router();

router.post('/', Review.createReview);
router.get('/', Review.getAllReviews);
router.get('/:id', Review.getReviewById);
router.put('/:id', Review.updateReview);
router.delete('/:id', Review.deleteReviewById);

export default router;