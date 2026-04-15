import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // ✅ image is now optional — admin can add category by name only
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;