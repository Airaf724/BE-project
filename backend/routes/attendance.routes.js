// routes/event.routes.js
import express from "express";
import {
  checkAttendanceStatus,
  generateAttendanceCode,
  verifyAttendanceCode,
} from "../controller/attendance.controller.js";

const router = express.Router();

// Existing routes (commented out for reference)
// ...

// New Attendance Code routes
router.post("/:eventId/generate-attendance-code", generateAttendanceCode);
router.post("/verify-attendance-code", verifyAttendanceCode);
router.post("/:eventId/status", checkAttendanceStatus);
export default router;
