const express = require("express");
const { getClientDashboard, getPhotographerDashboard } = require("../Handlers/dashboardController");

const router = express.Router();

router.get("/client/:signupId", getClientDashboard);
router.get("/photographer/:signupId", getPhotographerDashboard);

module.exports = router;
