const express = require("express");
const control = require("../Handlers/photographerController");

const router = express.Router();

router.post("/add", control.createPhotographer);  // User submits profile data
router.get("/find",control.getPhotographers); // get photographer data
router.patch("/photographer/:id",control.updatePhotographer);

module.exports = router;
