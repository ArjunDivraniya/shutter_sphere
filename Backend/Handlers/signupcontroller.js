const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Client = require("../Models/UserModel");
const Photographer = require("../Models/photographerModel");

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let existingUser;
    if (role === "client") {
      existingUser = await Client.findOne({ email });
    } else {
      existingUser = await Photographer.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "client") {
      newUser = new Client({ name, email, password: hashedPassword, role });
    } else {
      newUser = new Photographer({ name, email, password: hashedPassword, role });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Client.findOne({ email }) || await Photographer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", { expiresIn: "1h" });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

module.exports = { signup, login };
