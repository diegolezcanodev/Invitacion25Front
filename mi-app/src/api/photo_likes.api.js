const API_URL = import.meta.env.VITE_API_URL || 'https://invitacion25front-production.up.railway.app';

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