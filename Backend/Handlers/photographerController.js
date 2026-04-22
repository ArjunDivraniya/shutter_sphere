const { pool } = require("../config/db");

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


// Search Photographers by Location & Specialization
const searchPhotographer = async (req, res) => {
    try {
        const { location, specialization } = req.query;
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

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const result = await pool.query(
            `SELECT id, signup_id, full_name, email, phone_number, address, city, specialization,
                    experience, portfolio_links, budget_range, availability, languages_spoken,
                    equipment_used, reviews, rating, price_per_hour
             FROM photographers
             ${whereClause}
             ORDER BY id DESC`,
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

module.exports = { createPhotographer, getPhotographers, updatePhotographer, searchPhotographer };
