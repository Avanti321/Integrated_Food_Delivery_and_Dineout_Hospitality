import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Place Order ──────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5174";

    try {
        const newOrder = new orderModel({
            userId:  req.user.id,          // ✅ auth middleware sets req.user.id
            items:   req.body.items,
            amount:  req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        // Clear user cart after placing order
        await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        // Add delivery charges line
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 2 * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("placeOrder error:", error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// ─── Verify Payment ───────────────────────────────────────────────────────────
// Called by Stripe redirect after checkout
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            // ✅ FIX: set payment: true so MongoDB shows true after successful payment
            await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Order Confirmed" });
            res.json({ success: true, message: "Payment confirmed" });
        } else {
            // Payment cancelled — delete the pending order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment cancelled" });
        }
    } catch (error) {
        console.log("verifyOrder error:", error);
        res.json({ success: false, message: "Error verifying payment" });
    }
};

// ─── Get Orders for Logged-in User ───────────────────────────────────────────
const userOrders = async (req, res) => {
    try {
        // ✅ FIX: was req.userId — auth middleware sets req.user.id
        const orders = await orderModel.find({ userId: req.user.id }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("userOrders error:", error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// ─── List All Orders (Admin) ──────────────────────────────────────────────────
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("listOrders error:", error);
        res.json({ success: false, message: "Error" });
    }
};

// ─── Update Order Status (Admin) ─────────────────────────────────────────────
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log("updateStatus error:", error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };