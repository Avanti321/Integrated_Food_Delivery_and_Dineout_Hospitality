import Booking from "../models/bookingModel.js";

// ── Helper: auto-expire past bookings ────────────────────────────────────────
// Checks if booking date+time has passed and marks it "Completed"
const autoExpireBookings = async (bookings) => {
    const now = new Date();
    const updates = [];

    for (const b of bookings) {
        if (b.status === "Pending" || b.status === "Approved") {
            // Parse date (YYYY-MM-DD) + time (HH:MM) into a Date object
            const [year, month, day] = b.date.split("-").map(Number);
            const [hour, minute]     = b.time.split(":").map(Number);
            const bookingDateTime    = new Date(year, month - 1, day, hour, minute);

            if (now > bookingDateTime) {
                updates.push(
                    Booking.findByIdAndUpdate(b._id, { status: "Completed" }, { new: true })
                );
            }
        }
    }

    if (updates.length > 0) await Promise.all(updates);
};

// ── Create booking ────────────────────────────────────────────────────────────
export const createBooking = async (req, res) => {
    try {
        const { id } = req.user;
        const { restaurant, name, email, phone, numberOfPeople, date, time, note } = req.body;

        if (!restaurant || !name || !phone || !numberOfPeople || !date || !time) {
            return res.status(400).json({
                message: "Restaurant, name, phone, guests, date and time are required",
                success: false
            });
        }

        const existing = await Booking.findOne({
            restaurant, date, time, status: { $nin: ["Cancelled", "Completed"] }
        });

        if (existing) {
            return res.status(400).json({
                message: `This time slot at ${restaurant} is already booked. Please choose a different time.`,
                success: false
            });
        }

        const booking = await Booking.create({
            user: id, restaurant, name,
            email: email || "", phone, numberOfPeople, date, time, note: note || "",
        });

        res.status(201).json({ success: true, message: "Table booked successfully!", booking });
    } catch (error) {
        console.log("createBooking error:", error);
        return res.json({ message: "Internal server error", success: false });
    }
};

// ── User cancels their own booking ───────────────────────────────────────────
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { id } = req.user;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
        if (booking.user.toString() !== id.toString())
            return res.status(403).json({ success: false, message: "Not authorised" });
        if (booking.status === "Cancelled")
            return res.json({ success: false, message: "Already cancelled" });

        booking.status = "Cancelled";
        await booking.save();
        res.json({ success: true, message: "Booking cancelled", booking });
    } catch (error) {
        console.log(error);
        return res.json({ message: "Internal server error", success: false });
    }
};

// ── Get bookings for logged-in user ──────────────────────────────────────────
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.user;
        let bookings = await Booking.find({ user: id }).sort({ createdAt: -1 });

        // ✅ Auto-expire past bookings before returning
        await autoExpireBookings(bookings);

        // Re-fetch after potential updates
        bookings = await Booking.find({ user: id }).sort({ createdAt: -1 });
        res.status(200).json({ bookings, success: true });
    } catch (error) {
        console.log(error);
        return res.json({ message: "Internal server error", success: false });
    }
};

// ── Get all bookings (admin) ──────────────────────────────────────────────────
export const getAllBookings = async (req, res) => {
    try {
        let bookings = await Booking.find().populate("user", "name email").sort({ createdAt: -1 });
        await autoExpireBookings(bookings);
        bookings = await Booking.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json({ bookings, success: true });
    } catch (error) {
        console.log(error);
        return res.json({ message: "Internal server error", success: false });
    }
};

// ── Admin updates booking status ──────────────────────────────────────────────
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        booking.status = status;
        await booking.save();
        res.status(200).json({ success: true, message: "Booking status updated", booking });
    } catch (error) {
        console.log(error);
        return res.json({ message: "Internal server error", success: false });
    }
};