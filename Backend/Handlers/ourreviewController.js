const { pool } = require("../config/db");

exports.getReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, review, rating, client_id, photographer_id, profile_photo, created_at
       FROM reviews
       ORDER BY created_at DESC`
    );

    const reviews = result.rows.map((row) => ({
      _id: String(row.id),
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      review: row.review,
      rating: row.rating,
      clientId: row.client_id,
      photographerId: row.photographer_id,
      profilePhoto: row.profile_photo,
      createdAt: row.created_at,
    }));

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    let { name, email, role, review, rating } = req.body;

    if (!name || !email || !role || !review) {
      return res.status(400).json({ error: "name, email, role and review are required" });
    }

    if (rating === undefined) {
      rating = 5; 
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const userResult = await pool.query(
      "SELECT id, role, profile_photo FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let clientId = null;
    let photographerId = null;

    if (role.toLowerCase() === "client") {
      clientId = user.id;
    } else if (role.toLowerCase() === "photographer") {
      photographerId = user.id;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const inserted = await pool.query(
      `INSERT INTO reviews (name, email, role, review, rating, client_id, photographer_id, profile_photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, role, review, rating, client_id, photographer_id, profile_photo, created_at`,
      [name, email, role, review, rating, clientId, photographerId, user.profile_photo || ""]
    );

    const savedReview = inserted.rows[0];
    res.json({
      _id: String(savedReview.id),
      id: savedReview.id,
      name: savedReview.name,
      email: savedReview.email,
      role: savedReview.role,
      review: savedReview.review,
      rating: savedReview.rating,
      clientId: savedReview.client_id,
      photographerId: savedReview.photographer_id,
      profilePhoto: savedReview.profile_photo,
      createdAt: savedReview.created_at,
    });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Server error" });
  }
};
