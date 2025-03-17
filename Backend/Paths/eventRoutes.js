const express = require("express");
const { createEvent, getPhotographerEvents, deleteEvent } = require("../Handlers/eventController.js");;

const router = express.Router();

// Route to create an event
router.post("/event", createEvent); // Create event

// Route to get events for a specific photographer by signupId
router.get("/event/:signupId", getPhotographerEvents); // Get events

// Route to delete an event by eventId
router.delete("/event/:eventId", deleteEvent); // Delete event

module.exports = router;
