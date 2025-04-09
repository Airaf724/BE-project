import express from "express";
import {
  createEvents,
  getEvents,
  registerEvent,
  getDomainEvents,
  getEventById,
  getSearchResults,
  getEventsByAdmin,
} from "../controller/event.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
const router = express.Router();
import { upload } from "../middleware/multer_uploader.js";

// router.post("/create", verifyToken, checkAdmin, createEvents);
router.post("/create", verifyToken, checkAdmin, upload, createEvents);
router.get("/getevents", getEvents);
router.post("/geteventsbyid", getEventById);
router.get("/getdomainevents/:domain", getDomainEvents);
router.post("/:eventId/register", registerEvent);
router.post("/search", getSearchResults);
router.post("/geteventsbyadmin", getEventsByAdmin);
export default router;
