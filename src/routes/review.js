const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Create a new review
router.post('/', limiter, async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    const review = new Review({ restaurantId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get reviews for a restaurant
router.get('/:restaurantId', limiter, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurantId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
