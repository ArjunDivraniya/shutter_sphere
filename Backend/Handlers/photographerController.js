const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");

// Helper to check profile completion status
const checkCompletion = async (userId) => {
    const res = await pool.query(
        `SELECT full_name, bio, lat, lng, categories FROM photographers WHERE signup_id = $1`,
        [userId]
    );

    if (res.rows.length === 0) return false;

    const p = res.rows[0];
    const portfolioRes = await pool.query(
        "SELECT COUNT(*) FROM photographer_portfolio WHERE photographer_id = $1",
        [userId]
    );
    const photoCount = parseInt(portfolioRes.rows[0].count);

    const packageRes = await pool.query(
        "SELECT COUNT(*) FROM photographer_packages WHERE photographer_id = $1",
        [userId]
    );
    const packageCount = parseInt(packageRes.rows[0].count);

    // Required: full_name, bio, lat+lng, at least 1 photo, at least 1 package
    const isComplete = (
        p.full_name && 
        p.bio && p.bio.length >= 10 &&
        p.lat && p.lng &&
        p.categories && p.categories.length > 0 &&
        photoCount >= 1 &&
        packageCount >= 1
    );

    return !!isComplete;
};

// Create Photographer Profile
const createPhotographer = async (req, res) => {
    try {
        const { signupId, fullName, email, phoneNumber, address, specialization, experience, portfolioLinks, budgetRange, availability,languagesSpoken,equipmentUsed,reviews } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the photographer already exists
        const existingPhotographer = await pool.query(
            "SELECT id FROM photographers WHERE email = $1 LIMIT 1",
            [email]
        );
        if (existingPhotographer.rows.length > 0) {
            return res.status(400).json({ message: "Photographer already exists" });
        }

        const inserted = await pool.query(
            `INSERT INTO photographers (
                signup_id, full_name, email, phone_number, address, city, specialization,
                experience, portfolio_links, budget_range, availability, languages_spoken,
                equipment_used, reviews
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12,
                $13, $14
            )
            RETURNING id, signup_id, full_name, email, phone_number, address, city, specialization,
                      experience, portfolio_links, budget_range, availability, languages_spoken,
                      equipment_used, reviews, rating, price_per_hour`,
            [
                signupId || null,
                fullName || null,
                email,
                phoneNumber || null,
                address || null,
                req.body.city || null,
                specialization || null,
                experience || null,
                portfolioLinks || null,
                budgetRange || null,
                availability !== undefined ? availability : true,
                languagesSpoken || null,
                equipmentUsed || null,
                reviews || null,
            ]
        );

        const row = inserted.rows[0];
        res.status(201).json({
            _id: String(row.id),
            id: row.id,
            signupId: row.signup_id,
            name: row.full_name,
            fullName: row.full_name,
            email: row.email,
            phoneNumber: row.phone_number,
            address: row.address,
            city: row.city,
            specialization: row.specialization,
            specializations: row.specialization ? [row.specialization] : [],
            experience: row.experience,
            portfolioLinks: row.portfolio_links,
            budgetRange: row.budget_range,
            availability: row.availability,
            languagesSpoken: row.languages_spoken,
            equipmentUsed: row.equipment_used,
            reviews: row.reviews,
            rating: Number(row.rating) || 5,
            pricePerHour: Number(row.price_per_hour) || 0,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Photographers
const getPhotographers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, signup_id, full_name, email, phone_number, address, city, specialization,
                    experience, portfolio_links, budget_range, availability, languages_spoken,
                    equipment_used, reviews, rating, price_per_hour
             FROM photographers
             WHERE profile_complete = true
             ORDER BY id DESC`
        );

        const photographers = result.rows.map((row) => ({
            _id: String(row.id),
            id: row.id,
            signupId: row.signup_id,
            name: row.full_name,
            fullName: row.full_name,
            email: row.email,
            phoneNumber: row.phone_number,
            address: row.address,
            city: row.city,
            specialization: row.specialization,
            specializations: row.specialization ? [row.specialization] : [],
            experience: row.experience,
            portfolioLinks: row.portfolio_links,
            budgetRange: row.budget_range,
            availability: row.availability,
            languagesSpoken: row.languages_spoken,
            equipmentUsed: row.equipment_used,
            reviews: row.reviews,
            rating: Number(row.rating) || 5,
            pricePerHour: Number(row.price_per_hour) || 0,
        }));

        res.json(photographers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Photographer Profile
const updatePhotographer = async (req, res) => {
    try {
        const photographerId = req.params.id || req.params.signupId;
        if (!photographerId) {
            return res.status(400).json({ message: "Photographer ID is required" });
        }

        const {
            fullName,
            email,
            phoneNumber,
            address,
            city,
            specialization,
            experience,
            portfolioLinks,
            budgetRange,
            availability,
            languagesSpoken,
            equipmentUsed,
            reviews,
            rating,
            pricePerHour,
        } = req.body;

        const updatedPhotographer = await pool.query(
            `UPDATE photographers
             SET full_name = COALESCE($1, full_name),
                 email = COALESCE($2, email),
                 phone_number = COALESCE($3, phone_number),
                 address = COALESCE($4, address),
                 city = COALESCE($5, city),
                 specialization = COALESCE($6, specialization),
                 experience = COALESCE($7, experience),
                 portfolio_links = COALESCE($8, portfolio_links),
                 budget_range = COALESCE($9, budget_range),
                 availability = COALESCE($10, availability),
                 languages_spoken = COALESCE($11, languages_spoken),
                 equipment_used = COALESCE($12, equipment_used),
                 reviews = COALESCE($13, reviews),
                 rating = COALESCE($14, rating),
                 price_per_hour = COALESCE($15, price_per_hour)
             WHERE id = $16
             RETURNING id, signup_id, full_name, email, phone_number, address, city, specialization,
                       experience, portfolio_links, budget_range, availability, languages_spoken,
                       equipment_used, reviews, rating, price_per_hour`,
            [
                fullName ?? null,
                email ?? null,
                phoneNumber ?? null,
                address ?? null,
                city ?? null,
                specialization ?? null,
                experience ?? null,
                portfolioLinks ?? null,
                budgetRange ?? null,
                availability ?? null,
                languagesSpoken ?? null,
                equipmentUsed ?? null,
                reviews ?? null,
                rating ?? null,
                pricePerHour ?? null,
                photographerId,
            ]
        );

        if (updatedPhotographer.rows.length === 0) {
            return res.status(404).json({ message: "Photographer not found!" });
        }

        const row = updatedPhotographer.rows[0];
        res.status(200).json({
            _id: String(row.id),
            id: row.id,
            signupId: row.signup_id,
            name: row.full_name,
            fullName: row.full_name,
            email: row.email,
            phoneNumber: row.phone_number,
            address: row.address,
            city: row.city,
            specialization: row.specialization,
            specializations: row.specialization ? [row.specialization] : [],
            experience: row.experience,
            portfolioLinks: row.portfolio_links,
            budgetRange: row.budget_range,
            availability: row.availability,
            languagesSpoken: row.languages_spoken,
            equipmentUsed: row.equipment_used,
            reviews: row.reviews,
            rating: Number(row.rating) || 5,
            pricePerHour: Number(row.price_per_hour) || 0,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating photographer", error: error.message });
    }
};

const getPhotographerById = async (req, res) => {
    try {
        const photographerId = req.params.id;

        const result = await pool.query(
            `SELECT p.*, u.profile_photo
             FROM photographers p
             LEFT JOIN users u ON p.signup_id = u.id
             WHERE CAST(p.id AS TEXT) = $1 OR CAST(p.signup_id AS TEXT) = $1
             LIMIT 1`,
            [photographerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Photographer not found" });
        }

        const row = result.rows[0];
        const signupId = row.signup_id;

        const packages = await pool.query(
            "SELECT id, name, price, duration, description FROM photographer_packages WHERE photographer_id = $1",
            [signupId]
        );

        const portfolio = await pool.query(
            "SELECT id, image_url, caption FROM photographer_portfolio WHERE photographer_id = $1 ORDER BY created_at DESC",
            [signupId]
        );

        const reviews = await pool.query(
            `SELECT id, name, review, rating, created_at, profile_photo 
             FROM reviews 
             WHERE photographer_id = $1 
             ORDER BY created_at DESC`,
            [signupId]
        );

        const achievements = await pool.query(
            "SELECT id, title, year, description FROM photographer_achievements WHERE photographer_id = $1 ORDER BY COALESCE(year, '0') DESC",
            [signupId]
        );

        return res.json({
            _id: String(row.id),
            id: row.id,
            signupId: row.signup_id,
            name: row.full_name,
            fullName: row.full_name,
            email: row.email,
            phoneNumber: row.phone_number,
            address: row.address,
            city: row.city,
            state: row.state,
            studioName: row.studio_name,
            bio: row.bio,
            specialization: row.specialization,
            specializations: row.categories ? row.categories.split(",").map(s => s.trim()) : (row.specialization ? [row.specialization] : []),
            experience: row.years_experience || row.experience,
            portfolioLinks: row.portfolio_links,
            budgetRange: row.budget_range,
            availability: row.availability,
            languagesSpoken: row.languages_spoken,
            equipmentUsed: row.equipment_used,
            rating: Number(row.rating_avg || row.rating) || 5,
            reviewCount: Number(row.review_count) || reviews.rows.length,
            packages: packages.rows.map(pkg => ({
                ...pkg,
                deliverables: pkg.description ? pkg.description.split(",").map(d => d.trim()) : []
            })),
            portfolio: portfolio.rows.map(p => ({
                id: p.id,
                image_url: p.image_url,
                caption: p.caption
            })),
            reviews: reviews.rows,
            achievements: achievements.rows
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load photographer", error: error.message });
    }
};


// Search Photographers by Location & Specialization
const searchPhotographer = async (req, res) => {
    try {
        const { location, specialization, query } = req.query;
        const values = [];
        const conditions = [];

        if (location) {
            values.push(`%${location}%`);
            conditions.push(`city ILIKE $${values.length}`);
        }
        if (specialization) {
            values.push(`%${specialization}%`);
            conditions.push(`specialization ILIKE $${values.length}`);
        }

        if (query) {
            values.push(`%${query}%`);
            const qIndex = values.length;
            conditions.push(`(
                full_name ILIKE $${qIndex}
                OR city ILIKE $${qIndex}
                OR address ILIKE $${qIndex}
                OR specialization ILIKE $${qIndex}
                OR COALESCE(experience::text, '') ILIKE $${qIndex}
                OR COALESCE(languages_spoken, '') ILIKE $${qIndex}
                OR COALESCE(equipment_used, '') ILIKE $${qIndex}
                OR COALESCE(reviews, '') ILIKE $${qIndex}
            )`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const result = await pool.query(
            `SELECT id, signup_id, full_name, email, phone_number, address, city, specialization,
                    experience, portfolio_links, budget_range, availability, languages_spoken,
                    equipment_used, reviews, rating, price_per_hour
             FROM photographers
             ${whereClause ? whereClause + " AND " : "WHERE "} profile_complete = true
             ORDER BY rating DESC, id DESC`,
            values
        );

        const photographers = result.rows.map((row) => ({
            _id: String(row.id),
            id: row.id,
            signupId: row.signup_id,
            name: row.full_name,
            fullName: row.full_name,
            email: row.email,
            phoneNumber: row.phone_number,
            address: row.address,
            city: row.city,
            specialization: row.specialization,
            specializations: row.specialization ? [row.specialization] : [],
            experience: row.experience,
            portfolioLinks: row.portfolio_links,
            budgetRange: row.budget_range,
            availability: row.availability,
            languagesSpoken: row.languages_spoken,
            equipmentUsed: row.equipment_used,
            reviews: row.reviews,
            rating: Number(row.rating) || 5,
            pricePerHour: Number(row.price_per_hour) || 0,
        }));

        res.json(photographers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- New Photographer Profile API ---

const getOwnProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await pool.query(
            `SELECT * FROM photographers WHERE signup_id = $1`,
            [userId]
        );

        if (profile.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const row = profile.rows[0];

        const portfolio = await pool.query(
            "SELECT id, image_url, caption FROM photographer_portfolio WHERE photographer_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        const packages = await pool.query(
            "SELECT id, name, price, duration, description FROM photographer_packages WHERE photographer_id = $1",
            [userId]
        );

        const reviews = await pool.query(
            `SELECT r.id, r.name, r.review, r.rating, r.created_at, u.profile_photo
             FROM reviews r
             LEFT JOIN users u ON r.client_id = u.id
             WHERE r.photographer_id = $1
             ORDER BY r.created_at DESC`,
            [userId]
        );

        const achievements = await pool.query(
            "SELECT id, title, year, description FROM photographer_achievements WHERE photographer_id = $1 ORDER BY COALESCE(year, '0') DESC",
            [userId]
        );

        return res.json({
            profile: {
                ...row,
                portfolio: portfolio.rows,
                packages: packages.rows.map(pkg => ({
                    ...pkg,
                    deliverables: pkg.description ? pkg.description.split(",").map(d => d.trim()) : []
                })),
                reviews: reviews.rows.map(r => ({
                    id: r.id,
                    name: r.name,
                    review: r.review,
                    rating: r.rating,
                    created_at: r.created_at,
                    profile_photo: r.profile_photo
                })),
                achievements: achievements.rows
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

const upsertPhotographerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            fullName, phone, avatarUrl, bio, studioName,
            address, city, state, lat, lng,
            categories, yearsExperience, languages, equipment,
            isActive
        } = req.body;

        // Convert array types to comma-separated strings if needed, or PostgreSQL array format
        // For simplicity with existing code, we use text, but spec says TEXT[]
        // I'll stick to strings/JSON for now or handle accordingly

        const result = await pool.query(
            `INSERT INTO photographers (
                signup_id, full_name, email, phone_number, bio, studio_name,
                address, city, state, lat, lng,
                categories, years_experience, languages_spoken, equipment_used,
                is_active, updated_at
            )
            VALUES ($1, $2, (SELECT email FROM users WHERE id = $1), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
            ON CONFLICT (signup_id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                phone_number = EXCLUDED.phone_number,
                bio = EXCLUDED.bio,
                studio_name = EXCLUDED.studio_name,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng,
                categories = EXCLUDED.categories,
                years_experience = EXCLUDED.years_experience,
                languages_spoken = EXCLUDED.languages_spoken,
                equipment_used = EXCLUDED.equipment_used,
                is_active = COALESCE(EXCLUDED.is_active, photographers.is_active),
                updated_at = CURRENT_TIMESTAMP
            RETURNING *`,
            [
                userId, fullName, phone, bio, studioName,
                address, city, state, lat, lng,
                categories, yearsExperience, languages, equipment,
                isActive
            ]
        );

        // Recalculate profile_complete
        const isComplete = await checkCompletion(userId);
        await pool.query(
            "UPDATE photographers SET profile_complete = $1 WHERE signup_id = $2",
            [isComplete, userId]
        );
        await pool.query(
            "UPDATE users SET profile_complete = $1 WHERE id = $2",
            [isComplete, userId]
        );

        res.json({ ...result.rows[0], profile_complete: isComplete });
    } catch (error) {
        console.error("Upsert profile error:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

const uploadPortfolioImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { imageUrl, caption } = req.body;

        const result = await pool.query(
            `INSERT INTO photographer_portfolio (photographer_id, image_url, caption)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, imageUrl, caption]
        );

        // Recalculate profile_complete
        const isComplete = await checkCompletion(userId);
        await pool.query(
            "UPDATE photographers SET profile_complete = $1 WHERE signup_id = $2",
            [isComplete, userId]
        );
        await pool.query(
            "UPDATE users SET profile_complete = $1 WHERE id = $2",
            [isComplete, userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error uploading photo", error: error.message });
    }
};

const deletePortfolioImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { photoId } = req.params;

        await pool.query(
            "DELETE FROM photographer_portfolio WHERE id = $1 AND photographer_id = $2",
            [photoId, userId]
        );

        // Recalculate profile_complete
        const isComplete = await checkCompletion(userId);
        await pool.query(
            "UPDATE photographers SET profile_complete = $1 WHERE signup_id = $2",
            [isComplete, userId]
        );
        await pool.query(
            "UPDATE users SET profile_complete = $1 WHERE id = $2",
            [isComplete, userId]
        );

        res.json({ message: "Photo deleted successfully", profile_complete: isComplete });
    } catch (error) {
        res.status(500).json({ message: "Error deleting photo", error: error.message });
    }
};

const getPackages = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        const result = await pool.query(
            "SELECT * FROM photographer_packages WHERE photographer_id = $1 ORDER BY price ASC",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages", error: error.message });
    }
};

const upsertPackage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, name, price, duration, description } = req.body;

        let result;
        if (id) {
            result = await pool.query(
                `UPDATE photographer_packages 
                 SET name = $1, price = $2, duration = $3, description = $4
                 WHERE id = $5 AND photographer_id = $6
                 RETURNING *`,
                [name, price, duration, description, id, userId]
            );
        } else {
            result = await pool.query(
                `INSERT INTO photographer_packages (photographer_id, name, price, duration, description)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [userId, name, price, duration, description]
            );
        }

        // Recalculate completion
        const isComplete = await checkCompletion(userId);
        await pool.query("UPDATE photographers SET profile_complete = $1 WHERE signup_id = $2", [isComplete, userId]);
        await pool.query("UPDATE users SET profile_complete = $1 WHERE id = $2", [isComplete, userId]);

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error saving package", error: error.message });
    }
};

const deletePackage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { packageId } = req.params;

        await pool.query(
            "DELETE FROM photographer_packages WHERE id = $1 AND photographer_id = $2",
            [packageId, userId]
        );

        const isComplete = await checkCompletion(userId);
        await pool.query("UPDATE photographers SET profile_complete = $1 WHERE signup_id = $2", [isComplete, userId]);
        await pool.query("UPDATE users SET profile_complete = $1 WHERE id = $2", [isComplete, userId]);

        res.json({ message: "Package deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting package", error: error.message });
    }
};

const upsertAchievement = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, title, year, description } = req.body;

        let result;
        if (id) {
            result = await pool.query(
                `UPDATE photographer_achievements 
                 SET title = $1, year = $2, description = $3
                 WHERE id = $4 AND photographer_id = $5
                 RETURNING *`,
                [title, year, description, id, userId]
            );
        } else {
            result = await pool.query(
                `INSERT INTO photographer_achievements (photographer_id, title, year, description)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [userId, title, year, description]
            );
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error saving achievement", error: error.message });
    }
};

const deleteAchievement = async (req, res) => {
    try {
        const userId = req.user.id;
        const { achievementId } = req.params;

        await pool.query(
            "DELETE FROM photographer_achievements WHERE id = $1 AND photographer_id = $2",
            [achievementId, userId]
        );

        res.json({ message: "Achievement deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting achievement", error: error.message });
    }
};

const advancedSearch = async (req, res) => {
    try {
        const {
            lat,
            lng,
            radius_km = 25,
            category, // array or string
            max_price,
            min_rating,
            date,
            sort_by = 'recommended',
            page = 1,
            limit = 12
        } = req.query;

        const offset = (Number(page) - 1) * Number(limit);
        const values = [];
        const conditions = [];

        // Base query
        let query = `
            SELECT p.*, 
                   u.profile_photo,
                   COALESCE(p.rating_avg, p.rating, 5.0) as final_rating,
                   (6371 * acos(cos(radians($1)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians($2)) + sin(radians($1)) * sin(radians(p.lat)))) AS distance_km
            FROM photographers p
            LEFT JOIN users u ON p.signup_id = u.id
        `;
        
        values.push(lat || 0, lng || 0);

        // Filters
        conditions.push("p.profile_complete = true");
        conditions.push("COALESCE(p.is_active, true) = true");

        if (lat && lng && radius_km) {
            // Radius filter logic is handled in the WHERE distance_km clause below using a subquery for performance
        }

        if (category) {
            const catArr = Array.isArray(category) ? category.filter(Boolean) : category.split(',').map(c => c.trim()).filter(Boolean);
            if (catArr.length > 0) {
                values.push(catArr);
                conditions.push(`p.categories::TEXT[] && $${values.length}`);
            }
        }

        if (max_price) {
            values.push(max_price);
            conditions.push(`p.price_per_hour <= $${values.length}`);
        }

        if (min_rating) {
            values.push(min_rating);
            conditions.push(`COALESCE(p.rating_avg, p.rating, 5.0) >= $${values.length}`);
        }

        if (date) {
            values.push(date);
            conditions.push(`NOT EXISTS (
                SELECT 1 FROM availability_blocks ab 
                WHERE ab.photographer_id = p.signup_id 
                AND ab.blocked_date = $${values.length}::DATE
                AND ab.status IN ('booked', 'blocked')
            )`);
        }

        let whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        // Wrap for radius filter if lat/lng present
        if (lat && lng && radius_km) {
            query = `SELECT * FROM (${query} ${whereClause}) sub WHERE distance_km <= ${Number(radius_km)}`;
            whereClause = ""; // already applied inside subquery or outer WHERE
        }

        // Sorting
        let orderBy = "";
        switch (sort_by) {
            case 'top_rated':
                orderBy = "ORDER BY final_rating DESC, review_count DESC";
                break;
            case 'price_asc':
                orderBy = "ORDER BY price_per_hour ASC";
                break;
            case 'price_desc':
                orderBy = "ORDER BY price_per_hour DESC";
                break;
            case 'nearest':
                orderBy = lat && lng ? "ORDER BY distance_km ASC" : "ORDER BY p.id DESC";
                break;
            case 'recommended':
            default:
                orderBy = "ORDER BY final_rating DESC, review_count DESC, p.id DESC";
                break;
        }

        const finalQuery = `${query} ${whereClause} ${orderBy} LIMIT ${Number(limit)} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) FROM (${query} ${whereClause}) count_sub`;

        const [results, totalCount] = await Promise.all([
            pool.query(finalQuery, values),
            pool.query(countQuery, values)
        ]);

        res.json({
            photographers: results.rows,
            total: parseInt(totalCount.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error("Advanced Search Error:", error);
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};

const getMapMarkers = async (req, res) => {
    try {
        const { lat, lng, radius_km = 50 } = req.query;
        if (!lat || !lng) return res.status(400).json({ message: "Lat/Lng required for map" });

        const query = `
            SELECT p.signup_id, p.full_name as name, p.lat, p.lng, 
                   COALESCE(p.rating_avg, 5.0) as rating_avg, 
                   u.profile_photo as avatar, 
                   COALESCE(p.price_per_hour, 0) as price_per_hour,
                   (6371 * acos(cos(radians($1)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians($2)) + sin(radians($1)) * sin(radians(p.lat)))) AS distance_km
            FROM photographers p
            LEFT JOIN users u ON p.signup_id = u.id
            WHERE p.profile_complete = true AND COALESCE(p.is_active, true) = true
            AND (6371 * acos(cos(radians($1)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians($2)) + sin(radians($1)) * sin(radians(p.lat)))) <= $3
        `;

        const result = await pool.query(query, [lat, lng, radius_km]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch map markers", error: error.message });
    }
};

const getSearchCategories = async (req, res) => {
    try {
        // In a real app, this might come from a dedicated table or distinct values in photographers
        const result = await pool.query("SELECT DISTINCT unnest(categories::TEXT[]) as cat FROM photographers WHERE categories IS NOT NULL AND categories != ''");
        const categories = result.rows.map(r => r.cat.trim()).filter(Boolean);
        // Fallback or union with fixed list if empty
        const defaultCats = ["Wedding", "Portrait", "Events", "Fashion", "Product", "Travel", "Corporate", "Maternity"];
        const uniqueCats = Array.from(new Set([...categories, ...defaultCats]));
        res.json(uniqueCats);
    } catch (error) {
        res.json(["Wedding", "Portrait", "Events", "Fashion", "Product", "Travel", "Corporate", "Maternity"]);
    }
};

const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);
        
        const result = await pool.query(
            "SELECT full_name as name, signup_id FROM photographers WHERE full_name ILIKE $1 AND profile_complete = true LIMIT 5",
            [`%${q}%`]
        );
        res.json(result.rows);
    } catch (error) {
        res.json([]);
    }
};

module.exports = { 
    createPhotographer, 
    getPhotographers, 
    updatePhotographer, 
    searchPhotographer, 
    getPhotographerById,
    getOwnProfile,
    upsertPhotographerProfile,
    uploadPortfolioImage,
    deletePortfolioImage,
    getPackages,
    upsertPackage,
    deletePackage,
    upsertAchievement,
    deleteAchievement,
    advancedSearch,
    getMapMarkers,
    getSearchCategories,
    getSearchSuggestions
};
