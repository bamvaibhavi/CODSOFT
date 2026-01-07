const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Replace the old require('dotenv').config(); with this:
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// MIDDLEWARE - VERY IMPORTANT
app.use(cors()); 
app.use(express.json()); // This allows the server to read the 'job' data you send

// MONGODB CONNECTION
console.log("Checking URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// JOB SCHEMA
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  postedAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// --- ROUTES ---

// GET: Fetch all jobs
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new job (This was the missing/404 route!)
app.post('/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob); // Sends the new job BACK to React
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a job
app.delete('/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));