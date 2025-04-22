import express from "express";
import { upload } from "../middleware/multer_uploader.js";
import {
  addReward,
  getAllRewards,
  getRewardsById,
  updateReward,
} from "../controller/reward.controller.js";

const router = express.Router();
router.post("/addreward", upload, addReward);
router.get("/getrewards", getAllRewards);
router.post("/getrewardsbyid", getRewardsById);
router.put("/updatereward/:id", upload, updateReward);
export default router;
