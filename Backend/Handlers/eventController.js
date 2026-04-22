const { pool } = require("../config/db");


// Create an event
 const createEvent = async (req, res) => {
    try {
        const { signupId, title, date, description, location, status, clientId, photographerId, clientName } = req.body;

        // Validate required fields
        if (!signupId || !title || !date) {
            return res.status(400).json({ message: "title, and date are required." });
        }

        const inserted = await pool.query(
            `INSERT INTO events (signup_id, title, date, description, location, status, client_id, photographer_id, client_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, signup_id, title, date, description, location, status, client_id, photographer_id, client_name, created_at`,
            [
                signupId,
                title,
                date,
                description || null,
                location || null,
                status || "Pending",
                clientId || null,
                photographerId || null,
                clientName || null,
            ]
        );

        const newEvent = inserted.rows[0];

        // Return the created event in frontend-compatible shape
        res.status(201).json({
            _id: String(newEvent.id),
            id: newEvent.id,
            signupId: newEvent.signup_id,
            title: newEvent.title,
            date: newEvent.date,
            description: newEvent.description,
            location: newEvent.location,
            status: newEvent.status,
            clientId: newEvent.client_id,
            photographerId: newEvent.photographer_id,
            clientName: newEvent.client_name,
            createdAt: newEvent.created_at,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

// Get events for a specific photographer
 const getPhotographerEvents = async (req, res) => {
    try {
        const { signupId } = req.params;

        // Fetch events for the photographer
        const result = await pool.query(
            `SELECT id, signup_id, title, date, description, location, status, client_id, photographer_id, client_name, created_at
             FROM events
             WHERE signup_id = $1
             ORDER BY date ASC`,
            [signupId]
        );

        const events = result.rows.map((event) => ({
            _id: String(event.id),
            id: event.id,
            signupId: event.signup_id,
            title: event.title,
            date: event.date,
            description: event.description,
            location: event.location,
            status: event.status,
            clientId: event.client_id,
            photographerId: event.photographer_id,
            clientName: event.client_name,
            createdAt: event.created_at,
        }));

        // If no events are found, return a message
        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this photographer." });
        }

        // Return the list of events
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};

// Delete an event by ID
 const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params; // Expecting `_id` from request params

        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required." });
        }

        const deletedEvent = await pool.query(
            `DELETE FROM events WHERE id = $1 RETURNING id, signup_id, title, date, description, location, status, client_id, photographer_id, client_name, created_at`,
            [eventId]
        );

        if (deletedEvent.rows.length === 0) {
            return res.status(404).json({ message: "Event not found." });
        }

        const event = deletedEvent.rows[0];
        res.status(200).json({
            message: "Event deleted successfully",
            event: {
                _id: String(event.id),
                id: event.id,
                signupId: event.signup_id,
                title: event.title,
                date: event.date,
                description: event.description,
                location: event.location,
                status: event.status,
                clientId: event.client_id,
                photographerId: event.photographer_id,
                clientName: event.client_name,
                createdAt: event.created_at,
            },
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};

const updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required." });
        }

        if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updated = await pool.query(
            `UPDATE events
             SET status = $1
             WHERE id = $2
             RETURNING id, signup_id, title, date, description, location, status, client_id, photographer_id, client_name, created_at`,
            [status, eventId]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ message: "Event not found." });
        }

        const event = updated.rows[0];
        return res.status(200).json({
            message: "Event status updated",
            event: {
                _id: String(event.id),
                id: event.id,
                signupId: event.signup_id,
                title: event.title,
                date: event.date,
                description: event.description,
                location: event.location,
                status: event.status,
                clientId: event.client_id,
                photographerId: event.photographer_id,
                clientName: event.client_name,
                createdAt: event.created_at,
            },
        });
    } catch (error) {
        console.error("Error updating event status:", error);
        return res.status(500).json({ message: "Error updating event status", error: error.message });
    }
};


module.exports ={deleteEvent,getPhotographerEvents,createEvent,updateEventStatus}