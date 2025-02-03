// const Signup=require("../Models/signupmodel")
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");




// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;


//         // Check if user already exists
//         let user = await Signup.findOne({ email });
//         if (user) return res.status(400).json({ message: "User already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);


//         // Create new user
//         user = new Signup({ name, email, password: hashedPassword });

//         await user.save();

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

// // Login User
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if user exists
//         const user = await Signup.findOne({ email });
//         if (!user) return res.status(400).json({ message: "Invalid credentials" });

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "7d" });

//         res.json({ message: "Login successful", token });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

// module.exports = { registerUser, loginUser };

const Signup = require("../Models/signupmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password,role } = req.body;

        // Check if user already exists
        let user = await Signup.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new Signup({ name, email, password: hashedPassword ,role});

        await user.save();

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

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "7d" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser };
