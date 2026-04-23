const { pool } = require("../config/db");

// POST /api/bookings - Submit a new booking request
const createBooking = async (req, res) => {
    try {
        const {
            clientId,
            photographerId,
            packageId,
            eventDate,
            eventStartTime,
            eventLocation,
            eventLat,
            eventLng,
            eventType,
            description,
            specialRequirements,
            referencePhotos,
            selectedAddons,
            isCustomRequest,
            totalPrice
        } = req.body;

        // Basic validation
        if (!clientId || !photographerId || !eventDate || !eventStartTime) {
            return res.status(400).json({ message: "ClientId, photographerId, date, and startTime are required." });
        }

        const query = `
            INSERT INTO bookings (
                client_id, photographer_id, package_id, event_date, event_start_time,
                event_location, event_lat, event_lng, event_type, description,
                special_requirements, reference_photos, selected_addons,
                is_custom_request, total_price, status, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'pending', CURRENT_TIMESTAMP)
            RETURNING *;
        `;

        const values = [
            clientId,
            photographerId,
            packageId || null,
            eventDate,
            eventStartTime,
            eventLocation || null,
            eventLat || null,
            eventLng || null,
            eventType || null,
            description || null,
            specialRequirements || null,
            referencePhotos || [],
            JSON.stringify(selectedAddons || []),
            Boolean(isCustomRequest),
            totalPrice || null
        ];

        const result = await pool.query(query, values);
        res.status(201).json({
            message: "Booking request submitted successfully",
            booking: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error submitting booking", error: error.message });
    }
};

// GET /api/bookings/:id - Get full booking details
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT b.*, 
                    u_client.name as client_name, u_client.email as client_email,
                    u_photo.name as photographer_name, u_photo.email as photographer_email,
                    p.full_name as photographer_full_name
             FROM bookings b
             JOIN users u_client ON u_client.id = b.client_id
             JOIN users u_photo ON u_photo.id = b.photographer_id
             LEFT JOIN photographers p ON p.signup_id = b.photographer_id
             WHERE b.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Error fetching booking", error: error.message });
    }
};

// PUT /api/bookings/:id/confirm - Photographer confirms
const confirmBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalPrice, photographerNote } = req.body;

        const result = await pool.query(
            `UPDATE bookings 
             SET status = 'confirmed', 
                 total_price = COALESCE($2, total_price), 
                 photographer_note = $3,
                 confirmed_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id, totalPrice, photographerNote]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = result.rows[0];

        // Trigger availability block
        try {
            await pool.query(
                `INSERT INTO availability_blocks (photographer_id, blocked_date, status, booking_id, start_time)
                 VALUES ($1, $2, 'booked', $3, $4)
                 ON CONFLICT (photographer_id, blocked_date) 
                 DO UPDATE SET status = 'booked', booking_id = EXCLUDED.booking_id, start_time = EXCLUDED.start_time`,
                [booking.photographer_id, booking.event_date, booking.id, booking.event_start_time]
            );
        } catch (availErr) {
            console.error("Failed to sync availability on confirm:", availErr);
        }

        res.status(200).json({ message: "Booking confirmed", booking });
    } catch (error) {
        console.error("Error confirming booking:", error);
        res.status(500).json({ message: "Error confirming booking", error: error.message });
    }
};

// PUT /api/bookings/:id/reject
const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { photographerNote } = req.body;

        if (!photographerNote) {
            return res.status(400).json({ message: "Note is required for rejection." });
        }

        const result = await pool.query(
            `UPDATE bookings 
             SET status = 'rejected', 
                 photographer_note = $2
             WHERE id = $1
             RETURNING *`,
            [id, photographerNote]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking rejected", booking: result.rows[0] });
    } catch (error) {
        console.error("Error rejecting booking:", error);
        res.status(500).json({ message: "Error rejecting booking", error: error.message });
    }
};

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch booking to check status and date
        const checkResult = await pool.query(`SELECT status, event_date FROM bookings WHERE id = $1`, [id]);
        if (checkResult.rows.length === 0) return res.status(404).json({ message: "Booking not found" });
        
        const booking = checkResult.rows[0];
        
        if (booking.status !== 'pending' && booking.status !== 'confirmed') {
            return res.status(400).json({ message: "Only pending or confirmed bookings can be cancelled." });
        }

        // 48h rule check
        if (booking.status === 'confirmed') {
            const eventDate = new Date(booking.event_date);
            const now = new Date();
            const diffHours = (eventDate - now) / (1000 * 60 * 60);
            if (diffHours < 48) {
                return res.status(400).json({ message: "Confirmed bookings cannot be cancelled within 48 hours of the event." });
            }
        }

        const result = await pool.query(
            `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
            [id]
        );

        // Remove availability block if it was confirmed
        if (booking.status === 'confirmed') {
            await pool.query(
                `DELETE FROM availability_blocks WHERE booking_id = $1 AND status = 'booked'`,
                [id]
            );
        }

        res.status(200).json({ message: "Booking cancelled", booking: result.rows[0] });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};

module.exports = {
    createBooking,
    getBookingById,
    confirmBooking,
    rejectBooking,
    cancelBooking
};
