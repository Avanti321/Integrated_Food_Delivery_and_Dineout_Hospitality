import menuModel from "../models/menuModel.js";

const getMenus = async (req, res) => {
    try {
        const filter = req.query.restaurant
            ? { restaurantName: { $regex: req.query.restaurant, $options: "i" } }
            : {};
        const menus = await menuModel.find(filter).sort({ category: 1, name: 1 });
        res.json({ success: true, data: menus });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching menus" });
    }
};

const addMenuItem = async (req, res) => {
    try {
        const { restaurantName, category, name, description, price, image } = req.body;
        const item = new menuModel({ restaurantName, category, name, description, price, image });
        await item.save();
        res.json({ success: true, message: "Menu item added", data: item });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding menu item" });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const item = await menuModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, message: "Updated", data: item });
    } catch (error) {
        res.json({ success: false, message: "Error updating" });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        await menuModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.json({ success: false, message: "Error deleting" });
    }
};

export { getMenus, addMenuItem, updateMenuItem, deleteMenuItem };