import express from "express";
import { upload } from "../middleware/multer_uploader.js";
import { addReward, getAllRewards } from "../controller/reward.controller.js";

const router = express.Router();
router.post("/addreward", upload, addReward);
router.get("/getrewards", getAllRewards);
export default router;
