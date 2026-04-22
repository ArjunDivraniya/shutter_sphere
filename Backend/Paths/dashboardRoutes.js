const express = require("express");
const { 
  getClientDashboard, 
  getPhotographerDashboard,
  getPhotographerRealtimeData,
  upsertPhotographerSettings,
  sendConversationMessage,
  markConversationRead
} = require("../Handlers/dashboardController");

const router = express.Router();

router.get("/client/:signupId", getClientDashboard);
router.get("/photographer/:signupId", getPhotographerDashboard);
router.get("/photographer/:signupId/realtime", getPhotographerRealtimeData);
router.post("/photographer/:signupId/settings", upsertPhotographerSettings);
router.post("/photographer/:signupId/chat", sendConversationMessage);
router.patch("/photographer/:signupId/chat/:threadId/read", markConversationRead);

module.exports = router;
