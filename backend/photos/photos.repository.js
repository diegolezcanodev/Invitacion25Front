import prisma from "../prisma/prisma.js";

// Repository for Photos

async function getAll() {
  const photos = await prisma.photos.findMany();
  return photos;
}

async function getOne(idPhoto) {
  const photo = await prisma.photos.findUnique({
    where: {
      id: parseInt(idPhoto, 10),
    },
    include: {
      _count: {
        select: { photo_likes: true }
      }
    }
  });
  return photo;
}

async function createOne(data) {
  const newPhoto = await prisma.photos.create({
    data: {
        url: data.url,
        caption: data.caption,
        author: data.author,
        created_at: new Date(),
    },
  });
  return newPhoto;
}

async function deleteOne(id) {
  const deletedPhoto = await prisma.photos.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  return deletedPhoto;
}

async function updateOne(id, data) {
  const updatedPhoto = await prisma.photos.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      url: data.url,
      caption: data.caption,
      author: data.author,
    },
  });
  return updatedPhoto;
}

export { getOne, getAll, createOne, deleteOne, updateOne };
