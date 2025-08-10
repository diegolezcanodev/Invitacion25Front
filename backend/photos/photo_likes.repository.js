import prisma from "../prisma/prisma.js";

async function getAll(idPhoto) {
  return prisma.photo_likes.findMany({
    where: { photo_id: parseInt(idPhoto, 10) }
  });
}

async function countLikes(idPhoto) {
  return prisma.photo_likes.count({
    where: { photo_id: parseInt(idPhoto, 10) }
  });
}

async function createOne(idPhoto, data) {
  return prisma.photo_likes.upsert({
    where: {
      photo_id_user_hash: {
        photo_id: parseInt(idPhoto, 10),
        user_hash: data.user_hash
      }
    },
    update: {},
    create: {
      photo_id: parseInt(idPhoto, 10),
      user_hash: data.user_hash
    }
  });
}

async function deleteOne(idPhoto, userHash) {
  return prisma.photo_likes.delete({
    where: {
      photo_id_user_hash: {
        photo_id: parseInt(idPhoto, 10),
        user_hash: userHash
      }
    }
  });
}

export { getAll, countLikes, createOne, deleteOne };
