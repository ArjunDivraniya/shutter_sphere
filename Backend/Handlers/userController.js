const User = require("../Models/UserModel");
const Signup = require("../Models/signupmodel");
const cloudinary = require("../utils/cloudinary");

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, city, state, country, photographerType, budgetRange } = req.body;
        const userId = req.params.userId; // Extract userId from request params

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        let profilePicture = null;

        // ✅ 1. Find User in Users Collection
        let user = await User.findOne({ clientId: userId });

        if (!user) {
            // ✅ 2. If User Not Found, Check in Signups Collection
            const existingSignup = await Signup.findById(userId);
            if (!existingSignup) {
                return res.status(404).json({ success: false, message: "User not found in signups collection" });
            }

            // ✅ 3. Create New User Entry Using Signup Data
            user = new User({
                signupId: existingSignup._id.toString(), // Convert ObjectId to string
                fullName: fullName || existingSignup.fullName,
                email: existingSignup.email,
                phoneNumber,
                profilePicture: null, // No profile picture initially
                address: {
                    city,
                    state,
                    country
                },
                photographerType,
                budgetRange
            });

            await user.save();
            return res.status(201).json({ success: true, message: "User profile created", user });
        }

        // ✅ 4. Upload Profile Picture if Provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "profile_pictures",
                width: 300,
                crop: "scale"
            });
            profilePicture = result.secure_url;
        } else {
            profilePicture = user.profilePicture; // Retain existing profile picture if not updated
        }

        // ✅ 5. Update Existing User Data
        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profilePicture = profilePicture;
        user.address = {
            city: city || user.address.city,
            state: state || user.address.state,
            country: country || user.address.country
        };
        user.photographerType = photographerType || user.photographerType;
        user.budgetRange = budgetRange || user.budgetRange;

        await user.save();
        return res.status(200).json({ success: true, message: "User profile updated", user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
