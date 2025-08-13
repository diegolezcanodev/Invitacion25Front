import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./photos.repository.js";
import { v2 as cloudinary } from "cloudinary";

// Controllers for Photos

export const getPhotos = async (req, res) => {
  console.log('📸 Getting all photos');
  const photos = await getAll();
  if (!photos || photos.length === 0) {
    const error = new Error("No existen photos cargadas aún.");
    error.status = 404;
    throw error;
  }
  res.json(photos);
};

export const getPhoto = async (req, res, next) => {
  console.log('📸 Getting photo with ID:', req.params.id);
  const photo = await getOne(req.params.id);
  if (!photo) {
    const error = new Error("Photo no encontrada.");
    error.status = 404;
    throw error;
  }
  res.json(photo);
};

export const createPhoto = async (req, res) => {
  console.log('📥 Creating photo with data:', req.body);
  console.log('📁 File info:', req.file ? 'File received' : 'No file');
  
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

  try {
    const newPhoto = await createOne(req.body, req.file);
    console.log('✅ Photo created successfully:', newPhoto.id);
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('❌ Error creating photo:', error);
    throw error;
  }
};

export const deletePhoto = async (req, res) => {
  console.log('🗑️ Deleting photo with ID:', req.params.id);
  
  try {
    const { deletedPhoto, cloudinaryId } = await deleteOne(req.params.id);
    
    // Si tiene cloudinary_id, eliminar de Cloudinary
    if (cloudinaryId) {
      console.log('☁️ Deleting from Cloudinary:', cloudinaryId);
      try {
        await cloudinary.uploader.destroy(cloudinaryId);
        console.log('✅ Deleted from Cloudinary successfully');
      } catch (cloudinaryError) {
        console.warn(`⚠️ No se pudo eliminar de Cloudinary ${cloudinaryId}:`, cloudinaryError.message);
      }
    }
    
    console.log('✅ Photo deleted successfully');
    res.status(200).json({ message: "Photo eliminada correctamente." });
  } catch (error) {
    console.error('❌ Error deleting photo:', error);
    throw error;
  }
};

export const updatePhoto = async (req, res) => {
  console.log('📝 Updating photo with ID:', req.params.id);
  console.log('📝 Update data:', req.body);
  
  try {
    const updatedPhoto = await updateOne(req.params.id, req.body);
    console.log('✅ Photo updated successfully');
    res.status(200).json(updatedPhoto);
  } catch (error) {
    console.error('❌ Error updating photo:', error);
    throw error;
  }
};