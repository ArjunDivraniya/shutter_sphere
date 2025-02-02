const express = require("express");
const { createPhotographer ,getPhotographers,updatePhotographer } = require("../Controllers/photographerController");

const router = express.Router();

router.post("/add", createPhotographer);  // User submits profile data
router.get("/find",getPhotographers); // get photographer data
router.patch("/photographer/:id",updatePhotographer);

module.exports = router;
