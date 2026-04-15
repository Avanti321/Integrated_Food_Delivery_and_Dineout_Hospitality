import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    name:        { type: String, required: true },
    phone:       { type: String, required: true, unique: true },
    email:       { type: String, default: "" },
    vehicle:     { type: String, default: "Bike" },   // Bike / Scooter / Cycle
    isAvailable: { type: Boolean, default: true },     // true = free, false = on delivery
    currentOrder:{ type: mongoose.Schema.Types.ObjectId, ref: "order", default: null },
    isActive:    { type: Boolean, default: true },     // active/deactivated by admin
}, { timestamps: true });

const deliveryBoyModel = mongoose.models.deliveryboy || mongoose.model("deliveryboy", deliveryBoySchema);
export default deliveryBoyModel;