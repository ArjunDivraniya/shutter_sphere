const express = require("express");
const { getRoleProfile, upsertRoleProfile, updatePortfolio, getPhotographerPortfolio } = require("../Handlers/profileController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/:signupId", getRoleProfile);
router.put("/:signupId", upsertRoleProfile);
router.post("/:signupId/portfolio", upload.array("images", 10), updatePortfolio);
router.get("/:signupId/portfolio", getPhotographerPortfolio);

module.exports = router;
