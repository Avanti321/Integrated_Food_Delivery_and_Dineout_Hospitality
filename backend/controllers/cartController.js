import userModel from "../models/userModel.js";
import Cart from "../models/cartModel.js";

// ── helper: sync the separate carts collection ────────────────────────────────
const syncCartCollection = async (userId, cartData) => {
    try {
        // Build items array from cartData object { foodId: qty }
        const items = Object.entries(cartData)
            .filter(([, qty]) => qty > 0)
            .map(([menuItem, quantity]) => ({ menuItem, quantity }));

        await Cart.findOneAndUpdate(
            { user: userId },
            { user: userId, items },
            { upsert: true, new: true }
        );
    } catch (e) {
        console.log("Cart sync error:", e.message);
    }
};

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.id);
        let cartData = userData.cartData || {};

        cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(req.user.id, { cartData });
        await syncCartCollection(req.user.id, cartData); // ✅ also saves to carts collection
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log("addToCart error:", error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.id);
        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) delete cartData[req.body.itemId];
        }

        await userModel.findByIdAndUpdate(req.user.id, { cartData });
        await syncCartCollection(req.user.id, cartData); // ✅ keeps carts collection in sync
        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.log("removeFromCart error:", error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.id);
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log("getCart error:", error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, getCart };