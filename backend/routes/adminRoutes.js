import express from "express";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import { protect, adminOnly } from "../middleware/auth.js"; // ✅ Import auth middleware

const router = express.Router();

// ✅ protect → verifies JWT token
// ✅ adminOnly → checks isAdmin flag, blocks non-admins with 403
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalOrders   = await Order.countDocuments();
    const totalUsers    = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      totalOrders,
      totalUsers,
      totalBookings,
      revenue: revenue[0]?.total || 0
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;