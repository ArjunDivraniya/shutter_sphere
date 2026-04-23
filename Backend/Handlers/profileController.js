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
        `SELECT r.id, r.name, r.review, r.rating, r.created_at, u.profile_photo
         FROM reviews r
         LEFT JOIN users u ON r.client_id = u.id
         WHERE r.photographer_id = $1
         ORDER BY r.created_at DESC`,
        [signupId]
      );

      const avgRatingResult = await pool.query(
        `SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg_rating,
                COUNT(*)::int AS total_reviews
         FROM reviews
         WHERE photographer_id = $1`,
        [signupId]
      );

      const packageResult = await pool.query(
        "SELECT id, name, price, duration, description FROM photographer_packages WHERE photographer_id = $1",
        [signupId]
      );

      const portfolioResultNew = await pool.query(
        "SELECT id, image_url, caption FROM photographer_portfolio WHERE photographer_id = $1 ORDER BY created_at DESC",
        [signupId]
      );

      const achievementResult = await pool.query(
        "SELECT id, title, year, description FROM photographer_achievements WHERE photographer_id = $1 ORDER BY COALESCE(year, '0') DESC",
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
          portfolio: portfolioResultNew.rows.map(p => ({
            id: p.id,
            image_url: p.image_url,
            caption: p.caption
          })),
          packages: packageResult.rows.map(pkg => ({
            ...pkg,
            deliverables: pkg.description ? pkg.description.split(",").map(d => d.trim()) : []
          })),
          achievements: achievementResult.rows,
          rating: avgRating,
          totalReviews,
          reviews: reviewResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
            review: row.review,
            rating: Number(row.rating) || 0,
            profile_photo: row.profile_photo,
            createdAt: row.created_at,
          })),
        },
      });
    }

    const clientProfileResult = await pool.query(
      `SELECT * FROM client_profiles
       WHERE user_id = $1
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
        email: user.email,
        phoneNumber: p?.phone || "",
        location: [p?.city, p?.state].filter(Boolean).join(", "),
        bio: p?.bio || "",
        profilePhoto: p?.avatar_url || user.profile_photo || "",
        city: p?.city || "",
        state: p?.state || "",
        lat: p?.lat,
        lng: p?.lng,
        profileComplete: p?.profile_complete || false,
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
      phone,
      location,
      city,
      state,
      lat,
      lng,
      bio,
      profilePhoto,
      avatarUrl,
      specialization,
      categories,
      experience,
      description,
      budgetRange,
      pricePerHour,
      languagesSpoken,
      equipmentUsed,
      availability,
      portfolio,
      packages,
      achievements,
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
      [name || null, profilePhoto || avatarUrl || null, signupId]
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
         ON CONFLICT (signup_id)
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
          location || null,
          city || null,
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

      // Save Packages
      if (Array.isArray(packages)) {
        // Simple approach: clear and re-insert
        await pool.query("DELETE FROM photographer_packages WHERE photographer_id = $1", [signupId]);
        for (const pkg of packages) {
          await pool.query(
            "INSERT INTO photographer_packages (photographer_id, name, price, duration, description) VALUES ($1, $2, $3, $4, $5)",
            [signupId, pkg.name, pkg.price, pkg.duration, Array.isArray(pkg.deliverables) ? pkg.deliverables.join(",") : pkg.deliverables]
          );
        }
      }

      // Save Achievements
      if (Array.isArray(achievements)) {
        await pool.query("DELETE FROM photographer_achievements WHERE photographer_id = $1", [signupId]);
        for (const ach of achievements) {
          const title = typeof ach === "string" ? ach : ach.title;
          const year = ach.year || null;
          const desc = ach.description || null;
          await pool.query(
            "INSERT INTO photographer_achievements (photographer_id, title, year, description) VALUES ($1, $2, $3, $4)",
            [signupId, title, year, desc]
          );
        }
      }
    } else {
      await pool.query(
        `INSERT INTO client_profiles (
            user_id, full_name, phone, avatar_url, bio, city, state, lat, lng, profile_complete, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id)
         DO UPDATE SET
            full_name = COALESCE(EXCLUDED.full_name, client_profiles.full_name),
            phone = COALESCE(EXCLUDED.phone, client_profiles.phone),
            avatar_url = COALESCE(EXCLUDED.avatar_url, client_profiles.avatar_url),
            bio = COALESCE(EXCLUDED.bio, client_profiles.bio),
            city = COALESCE(EXCLUDED.city, client_profiles.city),
            state = COALESCE(EXCLUDED.state, client_profiles.state),
            lat = COALESCE(EXCLUDED.lat, client_profiles.lat),
            lng = COALESCE(EXCLUDED.lng, client_profiles.lng),
            profile_complete = true,
            updated_at = CURRENT_TIMESTAMP`,
        [signupId, name || null, phone || phoneNumber || null, avatarUrl || profilePhoto || null, bio || null, city || null, state || null, lat || null, lng || null]
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
