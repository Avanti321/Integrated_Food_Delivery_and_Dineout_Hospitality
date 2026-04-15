import express from "express";
import { getMenus, addMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";

const menuRouter = express.Router();

menuRouter.get("/list",         getMenus);
menuRouter.post("/add",         addMenuItem);
menuRouter.put("/update/:id",   updateMenuItem);
menuRouter.delete("/delete/:id",deleteMenuItem);

export default menuRouter;