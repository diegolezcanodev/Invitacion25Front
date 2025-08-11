import prisma from "../prisma/prisma.js";

// Repository for Photos

async function getAll() {
  const photos = await prisma.photos.findMany({
    orderBy: {
      created_at: 'desc'
    }
  });
  
  // Agregar la URL completa para servir las imágenes
  return photos.map(photo => ({
    ...photo,
    url: `/uploads/${photo.filename}` // URL para servir la imagen
  }));
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
  
  if (photo) {
    return {
      ...photo,
      url: `/uploads/${photo.filename}`
    };
  }
  
  return photo;
}

async function createOne(data, file) {
  const newPhoto = await prisma.photos.create({
    data: {
      filename: file.filename,
      original_name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      caption: data.caption,
      author: data.author,
      created_at: new Date(),
    },
  });
  
  return {
    ...newPhoto,
    url: `/uploads/${newPhoto.filename}`
  };
}

async function deleteOne(id) {
  // Primero obtener la información de la foto para eliminar el archivo
  const photo = await prisma.photos.findUnique({
    where: { id: parseInt(id, 10) }
  });
  
  if (!photo) {
    throw new Error('Foto no encontrada');
  }
  
  // Eliminar de la base de datos
  const deletedPhoto = await prisma.photos.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  
  return { deletedPhoto, filename: photo.filename };
}

async function updateOne(id, data) {
  const updatedPhoto = await prisma.photos.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      caption: data.caption,
      author: data.author,
    },
  });
  
  return {
    ...updatedPhoto,
    url: `/uploads/${updatedPhoto.filename}`
  };
}

export { getOne, getAll, createOne, deleteOne, updateOne };