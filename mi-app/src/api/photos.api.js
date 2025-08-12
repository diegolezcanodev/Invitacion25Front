import axios from "axios";

// Usa variable de entorno
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'invitacion25front-production.up.railway.app'
  : 'http://localhost:4000';

export const getPhotos = async () => {
  try {
    const response = await axios.get(`${API_URL}/photos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    throw error;
  }
}

export const createPhoto = async (photoData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('caption', photoData.caption);
    formData.append('author', photoData.author);

    const response = await axios.post(`${API_URL}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating photo:", error);
    throw error;
  }
}
