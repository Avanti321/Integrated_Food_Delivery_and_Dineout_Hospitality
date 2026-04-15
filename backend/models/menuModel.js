import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    category:       { type: String, required: true },
    name:           { type: String, required: true },
    description:    { type: String, default: "" },
    price:          { type: Number, required: true },
    image:          { type: String, default: "" },
    available:      { type: Boolean, default: true },
}, { timestamps: true });

const menuModel = mongoose.models.menu || mongoose.model("menu", menuSchema);
export default menuModel;