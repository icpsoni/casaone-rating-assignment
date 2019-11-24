const express = require("express");
const router = express.Router();
const ratingControllers = require('../controllers/ratingController');

//Rating Routes
router.get('/rating', ratingControllers.getRatings);
router.post('/rating', ratingControllers.postRating);
router.put('/rating', ratingControllers.updateRating);
router.delete('/rating', ratingControllers.deleteRating);

// Exporting Routes
module.exports = router;
