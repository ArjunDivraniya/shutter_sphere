const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    signupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photographer",
        required: true
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Event", eventSchema);
