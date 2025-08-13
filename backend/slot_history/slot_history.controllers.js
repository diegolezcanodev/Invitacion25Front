import {
  getOne,
  getAll,
  createOne,
  deleteOne,
  updateOne,
} from "./slot_history.repository.js";

// Controllers for Photos

export const getSlot_history = async (req, res) => {
  const slot_history = await getAll();
  if (!slot_history || slot_history.length === 0) {
    const error = new Error("No existe slot_history cargado aún.");
    error.status = 404;
    throw error;
  }
  res.json(slot_history);
};

export const getSlot_historyById = async (req, res, next) => {
  const slot_history = await getOne(req.params.id);
  if (!slot_history) {
    const error = new Error("Registro slot_history no encontrado.");
    error.status = 404;
    throw error;
  }
  res.json(slot_history);
};

export const createSlot_history = async (req, res) => {
  console.log('📥 Received in controller:', req.body);
    console.log('📥 Name field:', req.body.name);
    console.log('📥 Credits field:', req.body.credits);
  const newSlot_history = await createOne(req.body);
  res.status(201).json(newSlot_history);
};

export const deleteSlot_history = async (req, res) => {
  await deleteOne(req.params.id);
  res.status(200).json({ message: "Registro slot_history eliminada correctamente." });
};

export const updateSlot_history = async (req, res) => {
  const updatedSlot_history = await updateOne(req.params.id, req.body);
  res.status(200).json(updatedSlot_history);
};
