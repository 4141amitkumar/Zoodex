// controllers/predictController.js
const { exec } = require("child_process");
const path = require("path");

const predictAnimal = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = path.join(__dirname, "..", req.file.path);
  const pythonScript = path.join(__dirname, "..", "python", "predict.py");

  exec(`python "${pythonScript}" "${imagePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Prediction error:", stderr);
      return res.status(500).json({ error: "Prediction failed" });
    }

    const predictedAnimal = stdout.trim();
    res.json({ animal: predictedAnimal });
  });
};

module.exports = { predictAnimal };
