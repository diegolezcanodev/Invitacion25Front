import express from "express";
import { indexRoutes } from "./index.routes.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import cors from "cors";
import { photosRoutes } from "./photos/photos.routes.js";
import { photoLikesRoutes } from "./photos/photo_likes.routes.js";
import { slotRoutes } from "./slot_history/slot_history.routes.js";
import path from "path";
import dotenv from "dotenv";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';



// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://invitacion25-front.vercel.app";
const USE_CLOUD = process.env.USE_CLOUD === "true";

// Configuración de CORS
app.use(cors({
  origin: FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

// Rutas
app.use(indexRoutes);
app.use(photosRoutes);
app.use(photoLikesRoutes);
app.use(slotRoutes);

// Middleware de errores
app.use(errorHandler);

// Archivos estáticos solo si NO usamos Cloudinary
if (!USE_CLOUD) {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
} else {
  console.log("📸 Modo Cloud activado: las imágenes se sirven desde Cloudinary");
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 CORS habilitado para: ${FRONTEND_URL}`);
  console.log(`📦 Almacenamiento: ${USE_CLOUD ? "Cloudinary" : "Local"}`);
});
