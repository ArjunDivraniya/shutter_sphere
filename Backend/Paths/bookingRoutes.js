const express = require("express");
const router = express.Router();
const bookingController = require("../Handlers/bookingController");

// Submit a new booking
router.post("/", bookingController.createBooking);

// Get details
router.get("/:id", bookingController.getBookingById);

// Photographer actions
router.put("/:id/confirm", bookingController.confirmBooking);
router.put("/:id/reject", bookingController.rejectBooking);

// Client actions
router.put("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
