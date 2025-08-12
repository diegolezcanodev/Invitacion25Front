import axios from "axios";

// Usa variable de entorno
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'invitacion25front-production.up.railway.app'
  : 'http://localhost:4000';

export const getSlot_history = async () => {
  try {
    const response = await axios.get(`${API_URL}/slot_history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slot history:", error);
    throw error;
  }
}

export const createSlot_history = async (slot) => {
  try {
    const response = await axios.post(`${API_URL}/slot_history/`, slot);
    return response.data;
  } catch (error) {
    console.error("Error creating slot history register:", error);
    throw error;
  }
}
