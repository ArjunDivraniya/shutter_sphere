const mongoose = require("mongoose");

const PhotographerSchema = new mongoose.Schema({
    signupId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    profilePicture: { type: String },

    address: {
        city: { type: String, },
        state: { type: String, },
        country: { type: String,  }
    },

    specialization: [{ type: String, }],
    experience: { type: Number,  },

    portfolioLinks: [{ type: String,required: true }],

    budgetRange: {
        min: { type: Number, },
        max: { type: Number, }
    },

    availability: { type: Boolean, default: true },

    languagesSpoken: [{ type: String,  }],
    
    equipmentUsed: [{ type: String,  }],

    reviews: [
        {
            clientName: { type: String,  },
            rating: { type: Number,  min: 1, max: 5 },
            comment: { type: String, }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Photographer", PhotographerSchema);
