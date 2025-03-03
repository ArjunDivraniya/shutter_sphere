const express = require("express");
const { getReviews, addReview } = require("../Handlers/ourreviewController");

const router = express.Router();

// Routes
router.get("/reviews", getReviews);
router.post("/reviews", addReview);

module.exports = router;
