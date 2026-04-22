const { pool } = require("../config/db");
const cloudinary = require("../utils/cloudinary");

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, city, state, country, photographerType, budgetRange } = req.body;
        const signupId = req.params.signupId;

        if (!signupId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        let profilePicture = null;

        const existingSignupResult = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1 LIMIT 1",
            [signupId]
        );
        const existingSignup = existingSignupResult.rows[0];

        if (!existingSignup) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingProfileResult = await pool.query(
            `SELECT id, signup_id, full_name, email, phone_number, profile_picture,
                    city, state, country, photographer_type, budget_range
             FROM user_profiles
             WHERE signup_id = $1
             LIMIT 1`,
            [signupId]
        );
        const existingProfile = existingProfileResult.rows[0];

        // ✅ 4. Upload Profile Picture if Provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "profile_pictures",
                width: 300,
                crop: "scale"
            });
            profilePicture = result.secure_url;
        } else {
            profilePicture = existingProfile?.profile_picture || null;
        }

        const upserted = await pool.query(
            `INSERT INTO user_profiles (
                signup_id, full_name, email, phone_number, profile_picture,
                city, state, country, photographer_type, budget_range, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
            ON CONFLICT (signup_id)
            DO UPDATE SET
                full_name = EXCLUDED.full_name,
                email = EXCLUDED.email,
                phone_number = EXCLUDED.phone_number,
                profile_picture = EXCLUDED.profile_picture,
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                country = EXCLUDED.country,
                photographer_type = EXCLUDED.photographer_type,
                budget_range = EXCLUDED.budget_range,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, signup_id, full_name, email, phone_number, profile_picture,
                      city, state, country, photographer_type, budget_range, updated_at`,
            [
                signupId,
                fullName || existingProfile?.full_name || existingSignup.name,
                existingSignup.email,
                phoneNumber || existingProfile?.phone_number || null,
                profilePicture,
                city || existingProfile?.city || null,
                state || existingProfile?.state || null,
                country || existingProfile?.country || null,
                photographerType || existingProfile?.photographer_type || null,
                budgetRange || existingProfile?.budget_range || null,
            ]
        );

        const user = upserted.rows[0];
        const statusCode = existingProfile ? 200 : 201;
        return res.status(statusCode).json({
            success: true,
            message: existingProfile ? "User profile updated" : "User profile created",
            user: {
                _id: String(user.id),
                id: user.id,
                signupId: user.signup_id,
                fullName: user.full_name,
                email: user.email,
                phoneNumber: user.phone_number,
                profilePicture: user.profile_picture,
                address: {
                    city: user.city,
                    state: user.state,
                    country: user.country,
                },
                photographerType: user.photographer_type,
                budgetRange: user.budget_range,
                updatedAt: user.updated_at,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
