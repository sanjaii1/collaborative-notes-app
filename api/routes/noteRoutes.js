// api/routes/noteRoutes.js
import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
import { shareNote } from "../controllers/noteController.js";

const router = express.Router();

router.route("/").get(protect, getNotes).post(protect, createNote);
router.route("/:id").put(protect, updateNote).delete(protect, deleteNote);
router.post("/:id/share", protect, shareNote);
export default router;
