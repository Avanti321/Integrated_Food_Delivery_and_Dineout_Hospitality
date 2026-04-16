import jwt from "jsonwebtoken";

// ─── protect ─────────────────────────────────────────────────────────────────
// Verifies the JWT and attaches { id, isAdmin } to req.user
// Use this on any route that requires a logged-in user
export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Now reads both id AND isAdmin from the token
        req.user = { id: decoded.id, isAdmin: decoded.isAdmin };

        next();

    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// ─── adminOnly ────────────────────────────────────────────────────────────────
// Always use AFTER protect — blocks non-admin users with a 403
// Usage: router.get("/stats", protect, adminOnly, handler)
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Admin access only. You do not have permission."
    });
};