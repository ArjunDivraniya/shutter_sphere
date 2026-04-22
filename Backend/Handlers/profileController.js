const { pool } = require("../config/db");
const cloudinary = require("../utils/cloudinary");

const splitCsv = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getRoleProfile = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const userResult = await pool.query(
      `SELECT id, name, email, role, profile_photo, created_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [signupId]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "photographer") {
      const profileResult = await pool.query(
        `SELECT id, signup_id, full_name, email, phone_number, address, city, specialization,
                experience, portfolio_links, budget_range, availability, languages_spoken,
                equipment_used, reviews, rating, price_per_hour, bio, categories
         FROM photographers
         WHERE signup_id = $1
         ORDER BY id DESC
         LIMIT 1`,
        [signupId]
      );

      const reviewResult = await pool.query(
        `SELECT id, name, review, rating, created_at
         FROM reviews
         WHERE photographer_id = $1
         ORDER BY created_at DESC`,
        [signupId]
      );

      const avgRatingResult = await pool.query(
        `SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg_rating,
                COUNT(*)::int AS total_reviews
         FROM reviews
         WHERE photographer_id = $1`,
        [signupId]
      );

      const profile = profileResult.rows[0];
      const avgRating = Number(avgRatingResult.rows[0]?.avg_rating) || Number(profile?.rating) || 0;
      const totalReviews = Number(avgRatingResult.rows[0]?.total_reviews) || 0;

      return res.status(200).json({
        role: "photographer",
        profile: {
          signupId,
          name: profile?.full_name || user.name,
          email: profile?.email || user.email,
          phoneNumber: profile?.phone_number || "",
          location: profile?.city || "",
          address: profile?.address || "",
          specialization: profile?.specialization || "",
          categories: splitCsv(profile?.categories || profile?.specialization || ""),
          experience: profile?.experience || "",
          description: profile?.bio || profile?.reviews || "",
          budgetRange: profile?.budget_range || "",
          pricePerHour: Number(profile?.price_per_hour) || 0,
          languagesSpoken: profile?.languages_spoken || "",
          equipmentUsed: profile?.equipment_used || "",
          availability: profile?.availability !== false,
          profilePhoto: user.profile_photo || "",
          portfolio: splitCsv(profile?.portfolio_links),
          rating: avgRating,
          totalReviews,
          reviews: reviewResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
            review: row.review,
            rating: Number(row.rating) || 0,
            createdAt: row.created_at,
          })),
        },
      });
    }

    const clientProfileResult = await pool.query(
      `SELECT id, signup_id, full_name, email, phone_number, profile_picture, city, state, country,
              budget_range
       FROM user_profiles
       WHERE signup_id = $1
       LIMIT 1`,
      [signupId]
    );

    const clientReviewResult = await pool.query(
      `SELECT id, name, review, rating, created_at
       FROM reviews
       WHERE client_id = $1
       ORDER BY created_at DESC`,
      [signupId]
    );

    const bookingsResult = await pool.query(
      `SELECT id, title, date, location, status, photographer_id, created_at
       FROM events
       WHERE client_id = $1 OR signup_id = $1
       ORDER BY date DESC
       LIMIT 6`,
      [signupId]
    );

    const p = clientProfileResult.rows[0];
    return res.status(200).json({
      role: "client",
      profile: {
        signupId,
        name: p?.full_name || user.name,
        email: p?.email || user.email,
        phoneNumber: p?.phone_number || "",
        location: [p?.city, p?.state, p?.country].filter(Boolean).join(", "),
        budgetRange: p?.budget_range || "",
        profilePhoto: p?.profile_picture || user.profile_photo || "",
        rating: 0,
        totalReviews: clientReviewResult.rows.length,
        reviews: clientReviewResult.rows.map((row) => ({
          id: row.id,
          name: row.name,
          review: row.review,
          rating: Number(row.rating) || 0,
          createdAt: row.created_at,
        })),
        recentBookings: bookingsResult.rows,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load profile", error: error.message });
  }
};

const upsertRoleProfile = async (req, res) => {
  try {
    const signupId = Number(req.params.signupId);
    const {
      name,
      phoneNumber,
      location,
      address,
      specialization,
      categories,
      experience,
      description,
      budgetRange,
      pricePerHour,
      languagesSpoken,
      equipmentUsed,
      availability,
      profilePhoto,
      portfolio,
    } = req.body;

    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const userResult = await pool.query(
      `SELECT id, email, role
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [signupId]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           profile_photo = COALESCE($2, profile_photo)
       WHERE id = $3`,
      [name || null, profilePhoto || null, signupId]
    );

    if (user.role === "photographer") {
      const categoryCsv = Array.isArray(categories) ? categories.join(",") : categories || "";
      const portfolioCsv = Array.isArray(portfolio) ? portfolio.join(",") : portfolio || "";

      await pool.query(
        `INSERT INTO photographers (
           signup_id, full_name, email, phone_number, address, city, specialization,
           experience, portfolio_links, budget_range, availability, languages_spoken,
           equipment_used, reviews, price_per_hour, bio, categories
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (email)
         DO UPDATE SET
           full_name = COALESCE(EXCLUDED.full_name, photographers.full_name),
           phone_number = COALESCE(EXCLUDED.phone_number, photographers.phone_number),
           address = COALESCE(EXCLUDED.address, photographers.address),
           city = COALESCE(EXCLUDED.city, photographers.city),
           specialization = COALESCE(EXCLUDED.specialization, photographers.specialization),
           experience = COALESCE(EXCLUDED.experience, photographers.experience),
           portfolio_links = COALESCE(EXCLUDED.portfolio_links, photographers.portfolio_links),
           budget_range = COALESCE(EXCLUDED.budget_range, photographers.budget_range),
           availability = COALESCE(EXCLUDED.availability, photographers.availability),
           languages_spoken = COALESCE(EXCLUDED.languages_spoken, photographers.languages_spoken),
           equipment_used = COALESCE(EXCLUDED.equipment_used, photographers.equipment_used),
           reviews = COALESCE(EXCLUDED.reviews, photographers.reviews),
           price_per_hour = COALESCE(EXCLUDED.price_per_hour, photographers.price_per_hour),
           bio = COALESCE(EXCLUDED.bio, photographers.bio),
           categories = COALESCE(EXCLUDED.categories, photographers.categories)`,
        [
          signupId,
          name || null,
          user.email,
          phoneNumber || null,
          address || null,
          location || null,
          specialization || null,
          experience || null,
          portfolioCsv || null,
          budgetRange || null,
          availability !== undefined ? Boolean(availability) : true,
          languagesSpoken || null,
          equipmentUsed || null,
          description || null,
          pricePerHour || null,
          description || null,
          categoryCsv || null,
        ]
      );
    } else {
      const city = location || null;
      await pool.query(
        `INSERT INTO user_profiles (
            signup_id, full_name, email, phone_number, profile_picture, city, budget_range, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
         ON CONFLICT (signup_id)
         DO UPDATE SET
            full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
            phone_number = COALESCE(EXCLUDED.phone_number, user_profiles.phone_number),
            profile_picture = COALESCE(EXCLUDED.profile_picture, user_profiles.profile_picture),
            city = COALESCE(EXCLUDED.city, user_profiles.city),
            budget_range = COALESCE(EXCLUDED.budget_range, user_profiles.budget_range),
            updated_at = CURRENT_TIMESTAMP`,
        [signupId, name || null, user.email, phoneNumber || null, profilePhoto || null, city, budgetRange || null]
      );
    }

    return res.status(200).json({ message: "Profile saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save profile", error: error.message });
  }
};

module.exports = {
  getRoleProfile,
  upsertRoleProfile,
  updatePortfolio,
  getPhotographerPortfolio,
};

async function updatePortfolio(req, res) {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const portfolioUrls = req.body.portfolioUrls || [];
    
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "shutter_sphere/portfolio" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      portfolioUrls.push(...uploadedUrls);
    }

    const portfolioCsv = portfolioUrls.join(",");

    await pool.query(
      `UPDATE photographers
       SET portfolio_links = COALESCE($1, portfolio_links)
       WHERE signup_id = $2`,
      [portfolioCsv || null, signupId]
    );

    return res.status(200).json({
      message: "Portfolio updated successfully",
      portfolio: portfolioUrls,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update portfolio", error: error.message });
  }
}

async function getPhotographerPortfolio(req, res) {
  try {
    const signupId = Number(req.params.signupId);
    if (!signupId) {
      return res.status(400).json({ message: "Valid signupId is required" });
    }

    const result = await pool.query(
      `SELECT portfolio_links, specialization
       FROM photographers
       WHERE signup_id = $1
       ORDER BY id DESC
       LIMIT 1`,
      [signupId]
    );

    const photographer = result.rows[0];
    if (!photographer) {
      return res.status(404).json({ message: "Photographer not found" });
    }

    const portfolio = (photographer.portfolio_links || "")
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    return res.status(200).json({
      portfolio,
      specialization: photographer.specialization || "",
      totalImages: portfolio.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch portfolio", error: error.message });
  }
}
