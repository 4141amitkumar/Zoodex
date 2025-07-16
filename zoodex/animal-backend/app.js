// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const predictRoutes = require("./routes/predictRoutes");
const animalRoutes = require("./routes/animalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/predict", predictRoutes);
app.use("/api/animal", animalRoutes);

module.exports = app;
