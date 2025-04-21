import express from "express";
import {
  getUsersById,
  getUsersData,
  updateStatus,
  setProfile,
  sendSubscriptionMail,
} from "../controller/user.controller.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";

const Router = express.Router();

Router.post("/getusers", verifyToken, checkAdmin, getUsersData);
Router.post("/getusersbyids", getUsersById);
Router.post("/updateStatus", updateStatus);
Router.put("/:id/setprofile", setProfile);
Router.post("/newsletter", sendSubscriptionMail);
export default Router;
