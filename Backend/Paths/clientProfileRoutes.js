const express = require("express");
const { getProfile, createProfile, updateProfile, getPresignedUrl } = require("../Handlers/clientProfileController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/client", authMiddleware(["client"]), getProfile);
router.post("/client", authMiddleware(["client"]), createProfile);
router.put("/client", authMiddleware(["client"]), updateProfile);
router.post("/upload/avatar", authMiddleware(["client"]), getPresignedUrl);

module.exports = router;
