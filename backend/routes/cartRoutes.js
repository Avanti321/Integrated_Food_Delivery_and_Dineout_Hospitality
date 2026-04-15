import express from "express";
import { protect } from "../middleware/auth.js";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", protect, addToCart);
cartRouter.post("/remove", protect, removeFromCart);
cartRouter.post("/get", protect, getCart);

export default cartRouter;