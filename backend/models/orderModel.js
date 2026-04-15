import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:      { type: String, required: true },
    items:       { type: Array,  required: true },
    amount:      { type: Number, required: true },
    address:     { type: Object, required: true },
    status:      { type: String, default: "Food Processing" },
    date:        { type: Date,   default: Date.now },
    payment:     { type: Boolean, default: false },
    // ✅ NEW: stores the assigned delivery boy's ID
    deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: "deliveryboy", default: null }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
export default orderModel