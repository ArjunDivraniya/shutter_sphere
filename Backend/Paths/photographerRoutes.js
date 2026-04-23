const express = require("express");
const control = require("../Handlers/photographerController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/find", control.getPhotographers); 
router.get("/photographers", control.getPhotographers);
router.get("/photographer/:id", control.getPhotographerById);
router.get("/search", control.searchPhotographer);
router.get("/photographers/search", control.searchPhotographer);

// Public Profile Specifics (Modular)
router.get("/photographer/:id/full-profile", control.getFullProfile);
router.get("/photographer/:id/portfolio", control.getPortfolio);
router.get("/photographer/:id/packages", control.getPhotographerPackages);
router.get("/photographer/:id/availability", control.getAvailability);
router.get("/photographer/:id/reviews", control.getReviews);
router.post("/photographer/:id/view", authMiddleware(["client", "photographer"]), control.logProfileView);

// Protected profile routes
router.get("/photographer/profile", authMiddleware(["photographer"]), control.getOwnProfile);
router.post("/photographer/profile", authMiddleware(["photographer"]), control.upsertPhotographerProfile);
router.put("/photographer/profile", authMiddleware(["photographer"]), control.upsertPhotographerProfile);

// Portfolio management
router.post("/upload/portfolio", authMiddleware(["photographer"]), control.uploadPortfolioImage);
router.delete("/portfolio/:photoId", authMiddleware(["photographer"]), control.deletePortfolioImage);

// Package management
router.get("/packages/:userId?", authMiddleware(["photographer"]), control.getPackages);
router.post("/packages", authMiddleware(["photographer"]), control.upsertPackage);
router.put("/packages/reorder", authMiddleware(["photographer"]), control.reorderPackages);
router.put("/packages/:id", authMiddleware(["photographer"]), control.upsertPackage);
router.delete("/packages/:packageId", authMiddleware(["photographer"]), control.deletePackage);

// Achievement management
router.post("/achievements", authMiddleware(["photographer"]), control.upsertAchievement);
router.delete("/achievements/:achievementId", authMiddleware(["photographer"]), control.deleteAchievement);

// Legacy/Other
router.post("/add", control.createPhotographer);
router.patch("/photographer/:id", control.updatePhotographer);

module.exports = router;
