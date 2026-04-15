import express from "express";
import {
    getAllDeliveryBoys,
    addDeliveryBoy,
    updateDeliveryBoy,
    deleteDeliveryBoy,
    assignDeliveryBoy,
    markDelivered
} from "../controllers/deliveryBoyController.js";

const deliveryBoyRouter = express.Router();

deliveryBoyRouter.get("/list",          getAllDeliveryBoys);
deliveryBoyRouter.post("/add",          addDeliveryBoy);
deliveryBoyRouter.put("/update/:id",    updateDeliveryBoy);
deliveryBoyRouter.delete("/delete/:id", deleteDeliveryBoy);
deliveryBoyRouter.post("/assign",       assignDeliveryBoy);
deliveryBoyRouter.post("/delivered",    markDelivered);

export default deliveryBoyRouter;