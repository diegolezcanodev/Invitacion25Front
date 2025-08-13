import { parse } from "dotenv";
import prisma from "../prisma/prisma.js";

// Repository for Slot History

async function getAll() {
  const slot_history = await prisma.slot_history.findMany();
  return slot_history;
}

async function getOne(idSlot) {
  const slot_history = await prisma.slot_history.findUnique({
    where: {
      id: parseInt(idSlot, 10),
    },
  });
  return slot_history;
}

async function createOne(data) {
  console.log('📦 Repository received:', data);
  const newSlot = await prisma.slot_history.create({
    data: {
        name: data.name,
        credits: parseInt(data.credits, 10),
        created_at: new Date(),
    },
  });
  return newSlot;
}

async function deleteOne(idSlot) {
  const deletedSlot = await prisma.slot_history.delete({
    where: {
      id: parseInt(idSlot, 10),
    },
  });
  return deletedSlot;
}

async function updateOne(idSlot, data) {
  const updatedSlot_history = await prisma.slot_history.update({
    where: {
      id: parseInt(idSlot, 10),
    },
    data: {
      name: data.name,
      credits: parseInt(data.credits, 10),
    },
  });
  return updatedSlot_history;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
