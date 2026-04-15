import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    cancelBooking        // ✅ NEW
} from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/create",                    protect,             createBooking);
bookingRoutes.get("/my-bookings",                protect,             getUserBookings);
bookingRoutes.put("/cancel/:bookingId",          protect,             cancelBooking);       // ✅ user cancels own booking
bookingRoutes.get("/bookings",                   protect, adminOnly,  getAllBookings);
bookingRoutes.put("/update-status/:bookingId",   protect, adminOnly,  updateBookingStatus);

export default bookingRoutes;