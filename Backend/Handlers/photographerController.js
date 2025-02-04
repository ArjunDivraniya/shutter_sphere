const Photographer = require("../Models/photographerModel");


// Create Photographer Profile
const createPhotographer = async (req, res) => {
    try {
        const newPhotographer = new Photographer(req.body);
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

const updatePhotographer = async (req, res) => {
    try {
      const updatedPhotographer = await Photographer.findByIdAndUpdate(
        req.params.name,
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

  const searchphotographer =async (req, res) => {
    try {
        const { location, specialization } = req.query;
        const query = {};

        if (location) query.city = { $regex: location, $options: "i" };
        if (specialization) query.specialization = { $regex: specialization, $options: "i" };

        const photographers = await Photographer.find(query);
        res.json(photographers);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { createPhotographer, getPhotographers,updatePhotographer ,searchphotographer};
