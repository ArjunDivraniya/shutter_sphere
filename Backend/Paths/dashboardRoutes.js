const express = require("express");
const dashboardController = require("../Handlers/dashboardController");

const router = express.Router();

router.get("/client/:signupId", dashboardController.getClientDashboard);
router.get("/client/:signupId/realtime", dashboardController.getClientRealtimeData);
router.post("/client/:signupId/favorite", dashboardController.toggleFavoritePhotographer);
router.get("/photographer/:signupId", dashboardController.getPhotographerDashboard);
router.get("/photographer/:signupId/realtime", dashboardController.getPhotographerRealtimeData);
router.post("/photographer/:signupId/settings", dashboardController.upsertPhotographerSettings);
router.post("/photographer/:signupId/chat/send", dashboardController.sendConversationMessage);
router.post("/photographer/:signupId/chat/:threadId/read", dashboardController.markConversationRead);

module.exports = router;
