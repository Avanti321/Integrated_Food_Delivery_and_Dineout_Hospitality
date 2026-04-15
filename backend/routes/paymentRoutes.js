import express from "express";
const router = express.Router();
router.post("/create-order", (req, res) => {
    res.json({ success: false, message: "Use Stripe payment via /api/order/place instead" });
});
export default router;
