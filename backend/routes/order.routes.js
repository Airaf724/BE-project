import express from "express";
import {
  getAllOrders,
  placeOrder,
  updateOrder,
  sendCredentials,
  getUserOrders,
} from "../controller/order.controller.js";
// import { upload } from "../middleware/multer_uploader.js";

const router = express.Router();
router.post("/placeorder", placeOrder);
router.get("/:userId/getUserOrders", getUserOrders);
router.get("/getorders", getAllOrders);
router.put("/:id", updateOrder);
router.post("/send-credentials", sendCredentials);
export default router;
