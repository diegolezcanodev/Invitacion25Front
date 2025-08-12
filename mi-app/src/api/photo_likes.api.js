const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend-xxxx.up.railway.app'
  : 'http://localhost:4000';


export const getLikesByPhoto = async (photoId) => {
  try {
    const response = await fetch(`${API_URL}/photo/${photoId}/likes`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo likes:", error);
    throw error;
  }
};

export const createLike = async (photoId, userHash) => {
  try {
    const response = await fetch(`${API_URL}/photo/${photoId}/like/${userHash}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creando like:", error);
    throw error;
  }
};

export const deleteLike = async (photoId, userHash) => {
  try {
    const response = await fetch(`${API_URL}/photo/${photoId}/like/${userHash}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error eliminando like:", error);
    throw error;
  }
};