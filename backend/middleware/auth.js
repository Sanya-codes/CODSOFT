const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ message: "User not found" });
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role)
        return res.status(403).json({ message: `Access denied. ${role} only.` });
    next();
};

module.exports = { auth, requireRole };