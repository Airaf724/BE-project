import express from "express";
import {
  createNewCollege,
  getAllColleges,
} from "../controller/college.controller.js";
const router = express.Router();

router.post("/collegeForm", createNewCollege);
router.get("/getcolleges", getAllColleges);

export default router;
