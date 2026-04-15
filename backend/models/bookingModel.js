import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant:     { type: String, required: true },
    name:           { type: String, required: true },
    email:          { type: String, default: "" },
    phone:          { type: String, required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    date:           { type: String, required: true },
    time:           { type: String, required: true },
    note:           { type: String, default: "" },
    status: {
        type: String,
        // ✅ Added "Completed" — auto-set when booking date+time has passed
        enum: ["Pending", "Approved", "Cancelled", "Completed"],
        default: "Pending",
    },
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;