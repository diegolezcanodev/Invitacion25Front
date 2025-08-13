import { Router } from "express";
import multer from "multer";
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

// Configuración Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️ Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

// Storage en Cloudinary (SIEMPRE)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "invitacion25", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { width: 1200, height: 1200, crop: "limit" } // Limitar tamaño máximo
    ],
  },
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 Processing file:', file.originalname, file.mimetype);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  }
});

// Rutas
router.get("/photos", asyncHandler(getPhotos));
router.get("/photo/:id", asyncHandler(getPhoto));

// Crear foto con upload (SIEMPRE usa Cloudinary)
router.post("/photo", upload.single("image"), asyncHandler(createPhoto));

router.put("/photo/:id", asyncHandler(updatePhoto));
router.delete("/photo/:id", asyncHandler(deletePhoto));

export const photosRoutes = router;