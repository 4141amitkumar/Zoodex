// routes/animalRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const animalData = require("../data/animalInfo.json");

// Route: Animal of the Day (static selection based on date)
router.get("/animal-of-the-day", (req, res) => {
  const index = new Date().getDate() % animalData.length;
  res.json(animalData[index]);
});

// Route: Get info of specific animal
router.get("/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const animal = animalData.find(
    (a) => a.name.toLowerCase() === name
  );
  if (!animal) {
    return res.status(404).json({ error: "Animal not found" });
  }
  res.json(animal);
});

module.exports = router;
