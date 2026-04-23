const express = require("express");
const {
	signup,
	register,
	login,
	logout,
	refresh,
	verifyEmail,
	forgotPassword,
	resetPassword,
	googleAuth,
	googleCallback,
} = require("../Handlers/signupcontroller");

const router = express.Router();

// Legacy endpoints
router.post("/signup", signup);
router.post("/login", login);

// Auth API v1.1 endpoints
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refresh);
router.get("/auth/verify-email", verifyEmail);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);

module.exports = router;