import deliveryBoyModel from "../models/deliveryBoyModel.js";
import orderModel from "../models/orderModel.js";

const getAllDeliveryBoys = async (req, res) => {
    try {
        const boys = await deliveryBoyModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: boys });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const addDeliveryBoy = async (req, res) => {
    try {
        const { name, phone, email, vehicle } = req.body;
        const exists = await deliveryBoyModel.findOne({ phone });
        if (exists) return res.json({ success: false, message: "Phone number already registered" });
        const boy = new deliveryBoyModel({ name, phone, email, vehicle });
        await boy.save();
        res.json({ success: true, message: "Delivery boy added", data: boy });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding delivery boy" });
    }
};

const updateDeliveryBoy = async (req, res) => {
    try {
        const boy = await deliveryBoyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: boy });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const deleteDeliveryBoy = async (req, res) => {
    try {
        await deliveryBoyModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const assignDeliveryBoy = async (req, res) => {
    try {
        const { orderId, deliveryBoyId } = req.body;
        const frontend_url = process.env.FRONTEND_URL || "http://localhost:5174";

        await deliveryBoyModel.findByIdAndUpdate(deliveryBoyId, {
            isAvailable: false,
            currentOrder: orderId
        });

        await orderModel.findByIdAndUpdate(orderId, {
            deliveryBoy: deliveryBoyId,
            status: "Out for delivery"
        });

        const boy = await deliveryBoyModel.findById(deliveryBoyId);
        const driverUrl = `${frontend_url}/driver?orderId=${orderId}`;

        res.json({
            success: true,
            message: `${boy.name} assigned to order`,
            driverUrl,
            deliveryBoy: boy
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error assigning" });
    }
};

const markDelivered = async (req, res) => {
    try {
        const { orderId, deliveryBoyId } = req.body;
        await deliveryBoyModel.findByIdAndUpdate(deliveryBoyId, {
            isAvailable: true,
            currentOrder: null
        });
        await orderModel.findByIdAndUpdate(orderId, { status: "Delivered" });
        res.json({ success: true, message: "Order marked as delivered" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

export { getAllDeliveryBoys, addDeliveryBoy, updateDeliveryBoy, deleteDeliveryBoy, assignDeliveryBoy, markDelivered };