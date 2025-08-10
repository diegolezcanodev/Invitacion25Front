import axios from "axios";

export const getPhotos = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/photos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    throw error;
  }
}

export const createPhoto = async (photo) => {
  try {
    const response = await axios.post(`http://localhost:4000/photo`, photo);
    return response.data;
  } catch (error) {
    console.error("Error creating photo:", error);
    throw error;
  }
}