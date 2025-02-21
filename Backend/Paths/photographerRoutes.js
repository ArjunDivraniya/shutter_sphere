const express = require("express");
const control = require("../Handlers/photographerController");




const router = express.Router();



module.exports = router;


router.post("/add", control.createPhotographer);  // User submits profile data
router.get("/find",control.getPhotographers); // get photographer data
router.patch("/photographer/:id",control.updatePhotographer);

// Search photographers by location and specialization
router.get("/search",control.searchPhotographer );

module.exports = router;
