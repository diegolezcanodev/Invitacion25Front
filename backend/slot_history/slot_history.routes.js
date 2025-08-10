import { Router } from "express";
import {
  getSlot_history,
  getSlot_historyById,
  createSlot_history,
  deleteSlot_history,
  updateSlot_history,
} from "./slot_history.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/slot_history", asyncHandler(getSlot_history));

router.get("/slot_history/:id", asyncHandler(getSlot_historyById));

router.post("/slot_history", asyncHandler(createSlot_history));

router.put("/slot_history/:id", asyncHandler(updateSlot_history));

router.delete("/slot_history/:id", asyncHandler(deleteSlot_history));

export const slotRoutes = router;
