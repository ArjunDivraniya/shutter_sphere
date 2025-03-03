const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    review: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profilePhoto: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema,"ourreview");
