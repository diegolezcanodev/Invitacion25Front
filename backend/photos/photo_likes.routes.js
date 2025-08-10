import { Router } from "express";
import {
  getPhoto_likes,
  createPhoto_like,
  deletePhoto_like,
} from "./photo_likes.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/photo/:id/likes", asyncHandler(getPhoto_likes));       // Obtener todos los likes de una foto
router.post("/photo/:id/like", asyncHandler(createPhoto_like));    // Dar like (usa user_hash del request)
router.delete("/photo/:id/like", asyncHandler(deletePhoto_like));

export const photoLikesRoutes = router;
