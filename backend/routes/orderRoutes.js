import express from "express";
import { protect } from "../middleware/auth.js";
import {
    listOrders,
    placeOrder,
    userOrders,
    verifyOrder,
    updateStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", protect, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", protect, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;