const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { email, mobile, password } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving

    const newUser = new User({ email, mobile, password: hashedPassword }); // Create a new user
    await newUser.save(); // Save to database
    res.status(200).json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password); // Check if password matches
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    // Create a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/add", async (req, res) => {
  const { title, company, location, description, salary } = req.body;

  try {
    const newJob = new Job({ title, company, location, description, salary });
    await newJob.save();
    res
      .status(201)
      .json({ message: "Job listing added successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ error: "Failed to add job listing" });
  }
});

// Get all job listings
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job listings" });
  }
});

// Get a specific job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// Delete a specific job by ID
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    await job.remove(); // Deletes the job
    res.status(200).json({ message: "Job listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// Export the router

module.exports = router;
