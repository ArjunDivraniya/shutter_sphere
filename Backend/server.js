
// const express = require('express');
// const { MongoClient } = require('mongodb');
// const {ObjectId}=require('mongodb')

// const app = express();
// const port = 3000;

// // MongoDB connection details
// const uri = "mongodb://127.0.0.1:27017"; 
// const dbName = "codinggita";

// // Middleware
// app.use(express.json());

// let db, courses;

// // Connect to MongoDB and initialize collections
// async function initializeDatabase() {
//     try {
//         const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
//         console.log("Connected to MongoDB");

//         db = client.db(dbName);
//         courses = db.collection("courses");

//         // Start server after successful DB connection
//         app.listen(port, () => {
//             console.log(`Server running at http://localhost:${port}`);
//         });
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//         process.exit(1); // Exit if database connection fails
//     }
// }

// // Photographer Schema
// const photographerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     specialization: { type: String, required: true },
//     pricePerHour: { type: Number, required: true },
//     availability: { type: Boolean, default: true },
//     rating: { type: Number, default: 0 },
//     portfolio: { type: String },
// });

// const Photographer = mongoose.model("Photographer", photographerSchema);

// // Create a new photographer
// app.post("/photographers", async (req, res) => {
//     try {
//         const newPhotographer = new Photographer(req.body);
//         await newPhotographer.save();
//         res.status(201).json(newPhotographer);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Update photographer details
// app.patch("/photographers/:id", async (req, res) => {
//     try {
//         const updatedPhotographer = await Photographer.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         res.json(updatedPhotographer);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Delete a photographer
// app.delete("/photographers/:id", async (req, res) => {
//     try {
//         await Photographer.findByIdAndDelete(req.params.id);
//         res.json({ message: "Photographer deleted successfully" });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Search photographers by city
// router.get("/photographers/search", async (req, res) => {
//     try {
//         const { city } = req.query;
//         if (!city) {
//             return res.status(400).json({ error: "City parameter is required" });
//         }
//         const photographers = await Photographer.find({ city: city });
//         res.json(photographers);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const dotenv = require("dotenv");
const photographerRoutes = require("./Paths/photographerRoutes");
const loginrouter=require("./Paths/signuproutes")
const userRoutes=require("./Paths/userRoutes")
const reviewRoutes = require("./Paths/ourreview"); 
const eventRoutes = require("./Paths/eventRoutes");

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5174',  // Allow only the frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify the allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
}));



mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api", photographerRoutes);
app.use("/api",loginrouter)
app.use("/find",photographerRoutes)
app.use("/client", userRoutes);
app.use("/api", reviewRoutes)
app.use("/calendar", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
