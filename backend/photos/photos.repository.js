import prisma from "../prisma/prisma.js";

// Repository for Photos

async function getAll() {
  console.log('🔍 Fetching all photos from database');
  const photos = await prisma.photos.findMany({
    orderBy: {
      created_at: 'desc'
    }
  });
  
  console.log(`📊 Found ${photos.length} photos`);
  
  // Devolver con la URL correcta
  return photos.map(photo => ({
    ...photo,
    // Si filename contiene 'invitacion25/' es de Cloudinary, sino es local
    url: photo.filename.includes('invitacion25/') 
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${photo.filename}`
      : `/uploads/${photo.filename}`
  }));
}

async function getOne(idPhoto) {
  console.log('🔍 Fetching photo with ID:', idPhoto);
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
    console.log('✅ Photo found:', photo.id);
    return {
      ...photo,
      // Si filename contiene 'invitacion25/' es de Cloudinary, sino es local  
      url: photo.filename.includes('invitacion25/') 
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${photo.filename}`
        : `/uploads/${photo.filename}`
    };
  }
  
  console.log('❌ Photo not found');
  return photo;
}

async function createOne(data, file) {
  console.log('💾 Creating photo in database');
  console.log('📁 File data:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    // Para Cloudinary
    path: file.path,
    filename: file.filename,
    public_id: file.public_id
  });

  // Para Cloudinary, usar el public_id como filename y la URL completa
  let finalFilename;
  let finalUrl;

  if (file.path && file.public_id) {
    console.log('☁️ Using Cloudinary data');
    // Guardar el public_id como filename para poder eliminarlo después
    finalFilename = file.public_id;
    finalUrl = file.path; // URL completa de Cloudinary
  } else {
    console.log('💻 Using local storage fallback');
    finalFilename = file.filename;
    finalUrl = `/uploads/${file.filename}`;
  }

  const photoData = {
    filename: finalFilename, // public_id de Cloudinary o filename local
    original_name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    caption: data.caption,
    author: data.author,
    created_at: new Date(),
  };

  console.log('💾 Final data to save:', photoData);

  const newPhoto = await prisma.photos.create({
    data: photoData,
  });
  
  console.log('✅ Photo saved to database with ID:', newPhoto.id);
  
  return {
    ...newPhoto,
    url: finalUrl
  };
}

async function deleteOne(id) {
  console.log('🔍 Finding photo to delete:', id);
  
  // Primero obtener la información de la foto
  const photo = await prisma.photos.findUnique({
    where: { id: parseInt(id, 10) }
  });
  
  if (!photo) {
    throw new Error('Foto no encontrada');
  }
  
  console.log('📄 Photo to delete:', {
    id: photo.id,
    filename: photo.filename
  });
  
  // Eliminar de la base de datos
  const deletedPhoto = await prisma.photos.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  
  console.log('✅ Photo deleted from database');
  
  // Si el filename contiene 'invitacion25/', es un public_id de Cloudinary
  const isCloudinary = photo.filename.includes('invitacion25/');
  
  return { 
    deletedPhoto, 
    filename: photo.filename,
    cloudinaryId: isCloudinary ? photo.filename : null
  };
}

async function updateOne(id, data) {
  console.log('📝 Updating photo in database:', id);
  
  const updatedPhoto = await prisma.photos.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      caption: data.caption,
      author: data.author,
    },
  });
  
  console.log('✅ Photo updated in database');
  
  return {
    ...updatedPhoto,
    // Si filename contiene 'invitacion25/' es de Cloudinary, sino es local
    url: updatedPhoto.filename.includes('invitacion25/') 
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${updatedPhoto.filename}`
      : `/uploads/${updatedPhoto.filename}`
  };
}

export { getOne, getAll, createOne, deleteOne, updateOne };