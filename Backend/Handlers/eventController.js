import Event from "../Models/eventsModel.js";

// Create an event
export const createEvent = async (req, res) => {
    try {
        const { signupId, title, date, description, location } = req.body;

        // Validate required fields
        if (!signupId || !title || !date) {
            return res.status(400).json({ message: "title, and date are required." });
        }

        // Create a new event
        const newEvent = new Event({
            signupId,
            title,
            date,
            description,
            location
        });

        // Save the event to the database
        await newEvent.save();

        // Return the created event
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

// Get events for a specific photographer
export const getPhotographerEvents = async (req, res) => {
    try {
        const { signupId } = req.params;

        // Fetch events for the photographer
        const events = await Event.find({ signupId });

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
export const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params; // Expecting `_id` from request params

        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required." });
        }

        // Delete event by `_id`
        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.status(200).json({ message: "Event deleted successfully", event: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};
