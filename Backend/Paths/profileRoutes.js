const express = require("express");
const { getRoleProfile, upsertRoleProfile } = require("../Handlers/profileController");

const router = express.Router();

router.get("/:signupId", getRoleProfile);
router.put("/:signupId", upsertRoleProfile);

module.exports = router;
