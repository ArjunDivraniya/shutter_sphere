const { pool } = require("../config/db");

// Get current client's profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM client_profiles WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// Create profile during onboarding
const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let { fullName, phone, avatarUrl, bio, city, state, lat, lng } = req.body;

    // Sanitize lat/lng
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    const safeLat = isNaN(numLat) ? null : numLat;
    const safeLng = isNaN(numLng) ? null : numLng;

    const result = await pool.query(
      `INSERT INTO client_profiles (user_id, full_name, phone, avatar_url, bio, city, state, lat, lng, profile_complete)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
       ON CONFLICT (user_id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         phone = EXCLUDED.phone,
         avatar_url = EXCLUDED.avatar_url,
         bio = EXCLUDED.bio,
         city = EXCLUDED.city,
         state = EXCLUDED.state,
         lat = EXCLUDED.lat,
         lng = EXCLUDED.lng,
         profile_complete = true,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, fullName, phone, avatarUrl, bio, city, state, safeLat, safeLng]
    );

    // Also update users table status
    await pool.query("UPDATE users SET profile_complete = true WHERE id = $1", [userId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create profile error:", error);
    res.status(500).json({ message: "Error creating profile", error: error.message });
  }
};

// Update profile fields
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let { fullName, phone, avatarUrl, bio, city, state, lat, lng } = req.body;

    // Sanitize lat/lng
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    const safeLat = isNaN(numLat) ? null : numLat;
    const safeLng = isNaN(numLng) ? null : numLng;

    const result = await pool.query(
      `UPDATE client_profiles SET
         full_name = COALESCE($2, full_name),
         phone = COALESCE($3, phone),
         avatar_url = COALESCE($4, avatar_url),
         bio = COALESCE($5, bio),
         city = COALESCE($6, city),
         state = COALESCE($7, state),
         lat = COALESCE($8, lat),
         lng = COALESCE($9, lng),
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING *`,
      [userId, fullName, phone, avatarUrl, bio, city, state, safeLat, safeLng]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Mock S3/Cloudinary pre-signed URL (In a real app, use AWS SDK or Cloudinary SDK)
const getPresignedUrl = async (req, res) => {
  try {
    // For Cloudinary, we can return a signature or just use client-side upload
    // Since the project already uses Cloudinary, I'll return a basic Cloudinary config or signature
    // For now, I'll return a mock URL to satisfy the PRD's workflow description
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = "mock_signature_for_demonstration"; 
    
    res.json({
      uploadUrl: "https://api.cloudinary.com/v1_1/dncosrakg/image/upload",
      fields: {
        timestamp: timestamp,
        api_key: "mock_key",
        signature: signature,
        upload_preset: "ml_default"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error: error.message });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  getPresignedUrl
};
