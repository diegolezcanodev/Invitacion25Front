import express from "express";
import { indexRoutes } from "./index.routes.js";
import { errorHandler } from "./Middlewares/errorHandler.js";
import cors from "cors";
import { photosRoutes } from "./photos/photos.routes.js";
import { photoLikesRoutes } from "./photos/photo_likes.routes.js";
import { slotRoutes } from "./slot_history/slot_history.routes.js";
import path from "path"; // ← IMPORTAR path

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use(indexRoutes);
app.use(photosRoutes);
app.use(photoLikesRoutes);
app.use(slotRoutes);

app.use(errorHandler);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
