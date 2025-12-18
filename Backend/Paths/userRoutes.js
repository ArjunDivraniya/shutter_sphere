const express = require("express");
const router = express.Router();
const userController = require("../Handlers/userController");
const multer = require("multer");

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ✅ Update Profile Route (Make Sure `:userId` is in the Path)
router.patch("/profile/:signupId", upload.single("profilePicture"), userController.updateProfile);

module.exports = router;
