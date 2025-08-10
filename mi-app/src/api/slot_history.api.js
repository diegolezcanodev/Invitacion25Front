import axios from "axios";

export const getSlot_history = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/slot_history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slot history:", error);
    throw error;
  }
}

export const createSlot_history = async (slot) => {
  try {
    const response = await axios.post(`http://localhost:4000/slot_history/`, slot);
    return response.data;
  } catch (error) {
    console.error("Error creating slot history register:", error);
    throw error;
  }
}