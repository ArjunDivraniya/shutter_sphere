const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["client", "photographer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, role`,
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign(
      { id: createdUser.rows[0].id, role: createdUser.rows[0].role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      role: createdUser.rows[0].role,
      token,
      userId: createdUser.rows[0].id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userResult = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role: user.role, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { signup, login };
