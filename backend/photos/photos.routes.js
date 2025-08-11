import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getPhotos,
  getPhoto,
  createPhoto,
  deletePhoto,
  updatePhoto,
} from "./photos.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";

const router = Router();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de multer para manejar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configurar multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB
  }
});

// Rutas
router.get("/photos", asyncHandler(getPhotos));

router.get("/photo/:id", asyncHandler(getPhoto));

// Ruta para crear foto con upload de archivo
router.post("/photo", upload.single('image'), asyncHandler(createPhoto));

router.put("/photo/:id", asyncHandler(updatePhoto));

router.delete("/photo/:id", asyncHandler(deletePhoto));

export const photosRoutes = router;