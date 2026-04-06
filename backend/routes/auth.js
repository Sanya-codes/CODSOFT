const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
        if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });

        const user = await User.create({ name, email, password, role: role || "candidate" });
        const token = signToken(user._id);

        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: "Invalid email or password" });

        const token = signToken(user._id);
        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/me", require("../middleware/auth").auth, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;