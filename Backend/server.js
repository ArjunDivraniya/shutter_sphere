const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const photographerRoutes = require("./Paths/photographerRoutes");
const loginrouter=require("./Paths/signuproutes")
const userRoutes=require("./Paths/userRoutes")
const reviewRoutes = require("./Paths/ourreview"); 
const eventRoutes = require("./Paths/eventRoutes");
const dashboardRoutes = require("./Paths/dashboardRoutes");
const profileRoutes = require("./Paths/profileRoutes");
const searchRoutes = require("./Paths/searchRoutes");
const availabilityRoutes = require("./Paths/availabilityRoutes");
const { initDatabase } = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',  // Allow only the frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // Specify the allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  credentials: true,
}));

app.use("/api", photographerRoutes);
app.use("/api",loginrouter)
app.use("/find",photographerRoutes)
app.use("/client", userRoutes);
app.use("/api", reviewRoutes)
app.use("/calendar", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/availability", availabilityRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
