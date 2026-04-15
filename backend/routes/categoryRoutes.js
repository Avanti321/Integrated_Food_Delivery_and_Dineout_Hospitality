import express from "express";
import {
    addCategory,
    addBasicCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const categoryRoutes = express.Router();

categoryRoutes.post("/add",          upload.single("image"), addCategory);
categoryRoutes.post("/add-basic",    addBasicCategory);          // ✅ name only, no image
categoryRoutes.get("/list",          getAllCategories);
categoryRoutes.put("/update/:id",    upload.single("image"), updateCategory);
categoryRoutes.delete("/delete/:id", deleteCategory);

export default categoryRoutes;