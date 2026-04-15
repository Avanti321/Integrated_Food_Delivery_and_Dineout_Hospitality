import express from "express";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalBookings,
      revenue: revenue[0]?.total || 0
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;