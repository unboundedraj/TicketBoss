require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const Event = require("./models/Event");
const reservations = require("./routes/reservations");
const eventRoutes = require("./routes/event");

const app = express();
app.use(express.json());

// Swagger
const swaggerDocument = YAML.load("./src/swagger/openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/reservations", reservations);
app.use("/event", eventRoutes);

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    
    // Seed event after connection is established
    const exists = await Event.findOne({ eventId: "node-meetup-2025" });
    if (!exists) {
      await Event.create({
        eventId: "node-meetup-2025",
        name: "Node.js Meet-up",
        totalSeats: 500,
        availableSeats: 500,
        version: 0
      });
      console.log("Event seeded");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = { app, connectDB };
