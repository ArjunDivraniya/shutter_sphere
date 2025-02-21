const Signup = require("../Models/signupmodel");
const User = require("../Models/UserModel");
const Photographer = require("../Models/photographerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let existingUser = await Signup.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Signup entry
        const newSignup = new Signup({ name, email, password: hashedPassword, role });
        await newSignup.save();

        // Store user data in respective collection based on role
        if (role === "client") {
            const newUser = new User({
                signupId: newSignup._id,
                fullName: name,
                email
            });
            await newUser.save();
        } else if (role === "photographer") {
            const newPhotographer = new Photographer({
                signupId: newSignup._id,
                fullName: name,
                email
            });
            await newPhotographer.save();
        }

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await Signup.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "7d" });

        res.json({ message: "Login successful", token, role: user.role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser };
