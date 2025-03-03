const Review = require("../Models/ourreview");
const User = require("../Models/UserModel");
const Photographer=require("../Models/photographerModel")
const Signup =require("../Models/signupmodel") // Import User model

// Get all reviews
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
    const { name, email, role, review } = req.body;

    // Find user by email
    const user = await Signup.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let clientId = null;
    let photographerId = null;

    // Assign ID based on user role
    if (role.toLowerCase() === "client") {
      clientId = user._id;
    } else if (role.toLowerCase() === "photographer") {
      photographerId = user._id;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Create a new review
    const newReview = new Review({
      name,
      email,
      role,
      review,
      clientId,
      photographerId,
      profilePhoto: user.profilePhoto || "",
    });

    // Save the review
    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Server error" });
  }
};
