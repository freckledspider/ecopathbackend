// Dependencies
require("dotenv").config();
const { PORT = 3000, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// Database
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

// Schema
const LogSchema = new mongoose.Schema({
  date: String,
  time: String,
  location: String,
  length: Number,
  images: Array,
  observations: String
});

const Log = mongoose.model("Log", LogSchema);

// Middleware
app.use(cors()); 
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World! This is the ecopath backend index.");
});

// Index route
app.get("/log", async (req, res) => {
  try {
    res.json(await Log.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Create route
app.post("/log", async (req, res) => {
  try {
    res.json(await Log.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Update route
app.put("/log/:id", async (req, res) => {
  try {
    res.json(
      await Log.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete route
app.delete("/log/:id", async (req, res) => {
  try {
    res.json(await Log.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// Show route
app.get("/log/:id", async (req, res) => {
    try {
      res.json(await Log.findById(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

// Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));