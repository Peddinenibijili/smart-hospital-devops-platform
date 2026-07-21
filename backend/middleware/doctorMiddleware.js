// middleware/doctorMiddleware.js
module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "doctor") {
        return res.status(403).json({
            message: "Access Denied. Doctor Only."
        });
    }

    next();
};