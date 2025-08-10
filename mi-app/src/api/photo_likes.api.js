import axios from "axios";

export const getLikesByPhoto = async (id) => {
  try {
    const idPhoto = parseInt(id, 10);
    const response = await axios.get(`http://localhost:4000/photo/${idPhoto}/likes`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los likes de la photo:", error);
    throw error;
  }
};

export const createLike = async (id) => {
  try {
    const idPhoto = parseInt(id, 10);
    const response = await axios.post(`http://localhost:4000/photo/${idPhoto}/like`);
    return response.data;
  } catch (error) {
    console.error("Error al likear la photo:", error);
    throw error;
  }
};

export const deleteLike = async (id) => {
  try {
    const idPhoto = parseInt(id, 10);
    const response = await axios.delete(`http://localhost:4000/photo/${idPhoto}/like`);
    return response.data;
  } catch (error) {
    console.error("Error al deslikear la photo:", error);
    throw error;
  }
};