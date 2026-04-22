const express = require("express");
const cors = require('cors')
const dotenv = require("dotenv");
const photographerRoutes = require("./Paths/photographerRoutes");
const loginrouter=require("./Paths/signuproutes")
const userRoutes=require("./Paths/userRoutes")
const reviewRoutes = require("./Paths/ourreview"); 
const eventRoutes = require("./Paths/eventRoutes");
const dashboardRoutes = require("./Paths/dashboardRoutes");
const { initDatabase } = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',  // Allow only the frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // Specify the allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
}));

app.use("/api", photographerRoutes);
app.use("/api",loginrouter)
app.use("/find",photographerRoutes)
app.use("/client", userRoutes);
app.use("/api", reviewRoutes)
app.use("/calendar", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
