import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./photos.repository.js";
import fs from 'fs/promises';
import path from 'path';

// Controllers for Photos

export const getPhotos = async (req, res) => {
  const photos = await getAll();
  if (!photos || photos.length === 0) {
    const error = new Error("No existen photos cargadas aún.");
    error.status = 404;
    throw error;
  }
  res.json(photos);
};

export const getPhoto = async (req, res, next) => {
  const photo = await getOne(req.params.id);
  if (!photo) {
    const error = new Error("Photo no encontrada.");
    error.status = 404;
    throw error;
  }
  res.json(photo);
};

export const createPhoto = async (req, res) => {
  // Verificar que se subió un archivo
  if (!req.file) {
    const error = new Error("No se subió ninguna imagen.");
    error.status = 400;
    throw error;
  }

  // Verificar que los datos requeridos estén presentes
  if (!req.body.caption || !req.body.author) {
    const error = new Error("Caption y author son requeridos.");
    error.status = 400;
    throw error;
  }

  const newPhoto = await createOne(req.body, req.file);
  res.status(201).json(newPhoto);
};

export const deletePhoto = async (req, res) => {
  const { deletedPhoto, filename } = await deleteOne(req.params.id);
  
  // Intentar eliminar el archivo físico
  try {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`No se pudo eliminar el archivo ${filename}:`, error.message);
  }
  
  res.status(200).json({ message: "Photo eliminada correctamente." });
};

export const updatePhoto = async (req, res) => {
  const updatedPhoto = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedPhoto);
};