import { Router } from "express";
import {
  getPhotos,
  getPhoto,
  createPhoto,
  deletePhoto,
  updatePhoto,
} from "./photos.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
const router = Router();

router.get("/photos", asyncHandler(getPhotos));

router.get("/photo/:id", asyncHandler(getPhoto));

router.post("/photo", asyncHandler(createPhoto));

router.put("/photo/:id", asyncHandler(updatePhoto));

router.delete("/photo/:id", asyncHandler(deletePhoto));

export const photosRoutes = router;
