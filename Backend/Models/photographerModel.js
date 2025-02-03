const mongoose = require("mongoose");

const photographerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    portfolio: { type: String }, // Portfolio link
    
}, { timestamps: true });

module.exports = mongoose.model("Photographer", photographerSchema);
