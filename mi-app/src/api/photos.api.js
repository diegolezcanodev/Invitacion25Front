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

export const createPhoto = async (photoData, imageFile) => {
  try {
    // Crear FormData para enviar archivo + datos
    const formData = new FormData();
    formData.append('image', imageFile); // El archivo de imagen
    formData.append('caption', photoData.caption);
    formData.append('author', photoData.author);

    const response = await axios.post(`http://localhost:4000/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating photo:", error);
    throw error;
  }
}