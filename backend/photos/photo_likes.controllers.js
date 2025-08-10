import {
  getAll,
  createOne,
  deleteOne,
  countLikes
} from "./photo_likes.repository.js";

// Controllers for Photo Likes

export const getPhoto_likes = async (req, res) => {
  const likes = await getAll(req.params.id);
  if (!likes || likes.length === 0) {
    const error = new Error("No existen likes cargados para esa foto.");
    error.status = 404;
    throw error;
  }
  const count = await countLikes(req.params.id); // Corregido: usar req.params.id
  res.json({
    count,
    likes,
  });
};

export const createPhoto_like = async (req, res) => {
  // Crear el objeto data con user_hash desde los parámetros
  const data = {
    user_hash: req.params.userHash
  };
  
  const newLike = await createOne(req.params.id, data);
  res.status(201).json(newLike);
};

export const deletePhoto_like = async (req, res) => {
  // Pasar tanto el idPhoto como el userHash desde los parámetros
  await deleteOne(req.params.id, req.params.userHash);
  res.status(200).json({ message: "Like eliminado correctamente." });
};