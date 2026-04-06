const router = require("express").Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const { auth, requireRole } = require("../middleware/auth");
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.EMAIL_USER) return;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    } catch (e) {
        console.log("Email skipped:", e.message);
    }
};

router.get("/", async (req, res) => {
    try {
        const { q, location, type, page = 1, limit = 9 } = req.query;
        const filter = { status: "open" };
        if (q) filter.$text = { $search: q };
        if (location) filter.location = { $regex: location, $options: "i" };
        if (type) filter.type = type;

        const [jobs, total] = await Promise.all([
            Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
            Job.countDocuments(filter),
        ]);
        res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", auth, requireRole("employer"), async (req, res) => {
    try {
        const { title, company, location, type, salary, experience, description, requirements, tags } = req.body;
        if (!title || !company || !location || !description) return res.status(400).json({ message: "Required fields missing" });
        const job = await Job.create({ title, company, location, type, salary, experience, description, requirements, tags, employer: req.user._id });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", auth, requireRole("employer"), async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
        if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });
        Object.assign(job, req.body);
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", auth, requireRole("employer"), async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
        if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });
        await Application.deleteMany({ job: req.params.id });
        res.json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/:id/apply", auth, requireRole("candidate"), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("employer", "email name");
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.status === "closed") return res.status(400).json({ message: "This job is closed" });

        const existing = await Application.findOne({ job: req.params.id, candidate: req.user._id });
        if (existing) return res.status(400).json({ message: "Already applied" });

        const app = await Application.create({
            job: req.params.id,
            candidate: req.user._id,
            coverLetter: req.body.coverLetter,
            resumeUrl: req.body.resumeUrl,
        });

        await sendEmail(req.user.email, `Application Submitted – ${job.title}`,
            `<h2>Hi ${req.user.name}!</h2><p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been received.</p>`
        );

        res.status(201).json({ message: "Application submitted!", application: app });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "Already applied" });
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;