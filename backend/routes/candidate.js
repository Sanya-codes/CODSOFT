const router = require("express").Router();
const Application = require("../models/Application");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

router.get("/applications", auth, requireRole("candidate"), async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate("job", "title company location type salary")
            .sort({ createdAt: -1 });

        const formatted = applications.map(app => ({
            _id: app._id,
            jobTitle: app.job?.title,
            company: app.job?.company,
            location: app.job?.location,
            type: app.job?.type,
            salary: app.job?.salary,
            status: app.status,
            coverLetter: app.coverLetter,
            resumeUrl: app.resumeUrl,
            createdAt: app.createdAt,
        }));

        res.json({ applications: formatted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/profile", auth, requireRole("candidate"), async (req, res) => {
    res.json({ user: req.user });
});

router.put("/profile", auth, requireRole("candidate"), async (req, res) => {
    try {
        const { name, bio, skills, resumeUrl } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, bio, skills, resumeUrl },
            { new: true, runValidators: true }
        ).select("-password");
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;