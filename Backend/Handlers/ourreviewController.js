const Review = require("../Models/ourreview");
const User = require("../Models/UserModel");
const Photographer = require("../Models/photographerModel");
const Signup = require("../Models/signupmodel"); // Import User model

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    let { name, email, role, review, rating } = req.body;

    if (rating === undefined) {
      rating = 5; 
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    // Find user by email
    const user = await Signup.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let clientId = null;
    let photographerId = null;

    if (role.toLowerCase() === "client") {
      clientId = user._id;
    } else if (role.toLowerCase() === "photographer") {
      photographerId = user._id;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const newReview = new Review({
      name,
      email,
      role,
      review,
      rating,  
      clientId,
      photographerId,
      profilePhoto: user.profilePhoto || "",
    });

    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Server error" });
  }
};
