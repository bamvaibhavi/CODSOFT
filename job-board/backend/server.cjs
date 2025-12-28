const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const MONGO_URI = "mongodb+srv://bamvaibhavi_db_user:XffhCv83lhaj62cR@cluster0.5attdhv.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ MongoDB Error:", err));


const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    salary: { type: String, default: "Negotiable" },
    postedAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);


app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 }); 
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});


app.post('/jobs', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.json(newJob);
        console.log("📝 New Job Saved:", newJob.title);
    } catch (err) {
        res.status(500).json({ error: "Failed to save job" });
    }
});

app.listen(5000, () => {
    console.log("🚀 Server started on port 5000");
    // DELETE a job
    app.delete('/jobs/:id', async (req, res) => {
        try {
            const id = req.params.id;
            await Job.findByIdAndDelete(id);
            res.json({ message: "Job deleted successfully!" });
        } catch (err) {
            res.status(500).json({ error: "Failed to delete job" });
        }
    });
});