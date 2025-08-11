import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  getPhotos,
  getPhoto,
  createPhoto,
  deletePhoto,
  updatePhoto,
} from "./photos.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const USE_CLOUD = process.env.USE_CLOUD === "true";

// Configuración Cloudinary (solo si está activo)
if (USE_CLOUD) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configuración de multer
let upload;

if (USE_CLOUD) {
  // Storage en Cloudinary
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "invitacion25", // Carpeta en Cloudinary
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });
  upload = multer({ storage });
} else {
  // Crear carpeta local si no existe
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  };
  upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });
}

// Rutas
router.get("/photos", asyncHandler(getPhotos));
router.get("/photo/:id", asyncHandler(getPhoto));

// Crear foto con upload
router.post("/photo", upload.single("image"), asyncHandler(createPhoto));

router.put("/photo/:id", asyncHandler(updatePhoto));
router.delete("/photo/:id", asyncHandler(deletePhoto));

export const photosRoutes = router;
