import {
  getAll,
  createOne,
  deleteOne,
  countLikes
} from "./photo_likes.repository.js";

// Controllers for Photo Likes

export const getPhoto_likes = async (req, res) => {
  const likes = await getAll(req.params.idPhoto);
  if (!likes || likes.length === 0) {
    const error = new Error("No existen likes cargados para esa foto.");
    error.status = 404;
    throw error;
  }
  const count = await countLikes(req.params.idPhoto);
  res.json({
    count,
    likes,
  });
};

export const createPhoto_like = async (req, res) => {
  const newLike = await createOne(req.params.idPhoto, req.body);
  res.status(201).json(newLike);
};

export const deletePhoto_like = async (req, res) => {
  await deleteOne(req.params);
  res.status(200).json({ message: "Like eliminado correctamente." });
};