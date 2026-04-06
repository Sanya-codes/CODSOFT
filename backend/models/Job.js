const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Remote", "Internship", "Contract"], default: "Full-time" },
    salary: String,
    experience: String,
    description: { type: String, required: true },
    requirements: [String],
    tags: [String],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });

jobSchema.index({ title: "text", company: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Job", jobSchema);