const Photographer = require("../Models/photographerModel");

// Create Photographer Profile
const createPhotographer = async (req, res) => {
    try {
        const { signupId, fullName, email, phoneNumber, address, specialization, experience, portfolioLinks, budgetRange, availability,languagesSpoken,equipmentUsed,reviews } = req.body;

        // Check if the photographer already exists
        const existingPhotographer = await Photographer.findOne({ email });
        if (existingPhotographer) {
            return res.status(400).json({ message: "Photographer already exists" });
        }

        // Create new photographer profile
        const newPhotographer = new Photographer({
            signupId,
            fullName,
            email,
            phoneNumber,
            address,
            specialization,
            experience,
            portfolioLinks,
            budgetRange,
            availability,
            languagesSpoken,
            equipmentUsed,
            reviews
        });

        await newPhotographer.save();
        res.status(201).json(newPhotographer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Photographers
const getPhotographers = async (req, res) => {
    try {
        const photographers = await Photographer.find();
        res.json(photographers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Photographer Profile
const updatePhotographer = async (req, res) => {
    try {
        const { signupId } = req.params;

        const updatedPhotographer = await Photographer.findByIdAndUpdate(
            signupId,
            { $set: req.body },
            { new: true }
        );

        if (!updatedPhotographer) {
            return res.status(404).json({ message: "Photographer not found!" });
        }

        res.status(200).json(updatedPhotographer);
    } catch (error) {
        res.status(500).json({ message: "Error updating photographer", error });
    }
};


// Search Photographers by Location & Specialization
const searchPhotographer = async (req, res) => {
    try {
        const { location, specialization } = req.query;
        const query = {};

        if (location) query.city = { $regex: location, $options: "i" };
        if (specialization) query.specialization = { $regex: specialization, $options: "i" };

        const photographers = await Photographer.find(query);
        res.json(photographers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createPhotographer, getPhotographers, updatePhotographer, searchPhotographer };
