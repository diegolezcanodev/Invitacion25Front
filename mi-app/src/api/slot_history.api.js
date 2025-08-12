import axios from "axios";

// Usar variable de entorno con fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://invitacion25front-production.up.railway.app';

export const getSlot_history = async () => {
  try {
    const response = await axios.get(`${API_URL}/slot_history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slot history:", error);
    console.error("Full error details:", error.response || error);
    throw error;
  }
}

export const createSlot_history = async (slot) => {
  try {
    console.log('Making request to:', `${API_URL}/slot_history`); // Debug
    const response = await axios.post(`${API_URL}/slot_history`, slot);
    return response.data;
  } catch (error) {
    console.error("Error creating slot history register:", error);
    console.error("Request URL:", `${API_URL}/slot_history`);
    console.error("Full error details:", error.response || error);
    throw error;
  }
}