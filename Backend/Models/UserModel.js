const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        signupId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Signup", 
            require:true
        },
        fullName: { 
            type: String, 
            required: true, 
            trim: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
        },
        phoneNumber: { 
            type: String, 
            
            match: [/^\d{10,15}$/, "Invalid phone number"] 
        },
        profilePicture: { 
            type: String, 
            default: null // Stores Cloudinary URL 
        },
        address: {
            city: { type: String,  trim: true },
            state: { type: String,  trim: true },
            country: { type: String,  trim: true }
        },
        photographerType: { 
            type: String, 
            
            enum: ["Wedding", "Portrait", "Event", "Wildlife", "Fashion", "Sports", "Other"] 
        },
        budgetRange: { 
            type: String, 
            default: null 
        }
    },
    { timestamps: true } // Automatically adds createdAt & updatedAt timestamps
);

const User = mongoose.model("User", userSchema);
module.exports = User;
