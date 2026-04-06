const router = require("express").Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const { auth, requireRole } = require("../middleware/auth");

router.get("/jobs", auth, requireRole("employer"), async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
        res.json({ jobs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/applications", auth, requireRole("employer"), async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id }).select("_id");
        const jobIds = jobs.map(j => j._id);
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate("candidate", "name email skills bio")
            .populate("job", "title company")
            .sort({ createdAt: -1 });
        res.json({ applications });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/applications/:appId", auth, requireRole("employer"), async (req, res) => {
    try {
        const app = await Application.findById(req.params.appId).populate("job");
        if (!app) return res.status(404).json({ message: "Application not found" });
        if (app.job.employer.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Unauthorized" });
        app.status = req.body.status;
        await app.save();
        res.json({ application: app });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;