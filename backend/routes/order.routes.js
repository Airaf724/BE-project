import express from "express";
import { getAllOrders, placeOrder } from "../controller/order.controller.js";
const router = express.Router();
router.post("/placeorder", placeOrder);
router.get("/getorders", getAllOrders);
export default router;
