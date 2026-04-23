const express = require("express");
const control = require("../Handlers/photographerController");

const router = express.Router();
router.post("/add", control.createPhotographer);  // User submits profile data
router.get("/find",control.getPhotographers); // get photographer data
router.get("/photographers", control.getPhotographers);
router.get("/photographer/:id", control.getPhotographerById);
router.patch("/photographer/:id",control.updatePhotographer);

// Search photographers by location and specialization
router.get("/search",control.searchPhotographer );
router.get("/photographers/search", control.searchPhotographer);

module.exports = router;
