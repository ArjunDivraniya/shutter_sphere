const express = require("express");
const { getRoleProfile, upsertRoleProfile, updatePortfolio, getPhotographerPortfolio } = require("../Handlers/profileController");
const { getProfile: getClientProfile, createProfile: createClientProfile, updateProfile: updateClientProfile, getPresignedUrl } = require("../Handlers/clientProfileController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/client", authMiddleware(["client"]), getClientProfile);
router.post("/client", authMiddleware(["client"]), createClientProfile);
router.put("/client", authMiddleware(["client"]), updateClientProfile);
router.post("/client/upload/avatar", authMiddleware(["client"]), getPresignedUrl);

router.get("/:signupId", getRoleProfile);
router.put("/:signupId", upsertRoleProfile);
router.post("/:signupId/portfolio", upload.array("images", 10), updatePortfolio);
router.get("/:signupId/portfolio", getPhotographerPortfolio);

module.exports = router;
