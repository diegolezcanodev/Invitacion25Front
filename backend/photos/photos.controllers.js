import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./photos.repository.js";

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
  const newPhoto = await createOne(req.body);
  res.status(201).json(newPhoto);
};

export const deletePhoto = async (req, res) => {
  await deleteOne(req.params.id);
  res.status(200).json({ message: "Photo eliminada correctamente." });
};

export const updatePhoto = async (req, res) => {
  const updatedPhoto = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedPhoto);
};
