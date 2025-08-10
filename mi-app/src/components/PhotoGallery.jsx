import { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { getPhotos, createPhoto } from "../api/photos.api.js";
import { getLikesByPhoto, createLike, deleteLike } from "../api/photo_likes.api.js";

const PhotoGallery = ({ isDarkMode }) => {
  const [photos, setPhotos] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    author: "",
    caption: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [userHash, setUserHash] = useState("");

  // Generar hash único para el usuario (simulando identificación única)
  useEffect(() => {
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setUserHash(hash);
  }, []);

  // Cargar fotos al montar el componente
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const data = await getPhotos();
      // Cargar likes para cada foto
      const photosWithLikes = await Promise.all(
        data.map(async (photo) => {
          try {
            const likesData = await getLikesByPhoto(photo.id);
            return {
              ...photo,
              likes: likesData.count || 0,
              userLiked: likesData.likes?.some(like => like.user_hash === userHash) || false
            };
          } catch (error) {
            return { ...photo, likes: 0, userLiked: false };
          }
        })
      );
      setPhotos(photosWithLikes);
    } catch (error) {
      console.error("Error cargando fotos:", error);
      setPhotos([]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.author.trim() || !uploadData.caption.trim()) {
      return;
    }

    setIsUploading(true);

    try {
      // Simular subida de archivo (en un caso real, subirías a un servicio como Cloudinary)
      const imageUrl = URL.createObjectURL(selectedFile);
      
      const photoData = {
        url: imageUrl,
        caption: uploadData.caption.trim(),
        author: uploadData.author.trim()
      };

      await createPhoto(photoData);
      
      // Recargar fotos y resetear formulario
      await loadPhotos();
      setSelectedFile(null);
      setUploadData({ author: "", caption: "" });
      setShowUploadForm(false);
    } catch (error) {
      console.error("Error subiendo foto:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = async (photoId) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      
      if (photo.userLiked) {
        // Quitar like
        await deleteLike(photoId);
        setPhotos(photos.map(p => 
          p.id === photoId 
            ? { ...p, likes: p.likes - 1, userLiked: false }
            : p
        ));
      } else {
        // Dar like
        await createLike(photoId);
        setPhotos(photos.map(p => 
          p.id === photoId 
            ? { ...p, likes: p.likes + 1, userLiked: true }
            : p
        ));
      }
    } catch (error) {
      console.error("Error procesando like:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-24">
      {/* Header con botón de subir */}
      <div className="text-center mb-8 grid place-items-center">
        <h2 className={`text-4xl font-bold mb-4 transition-colors duration-500 ${
          isDarkMode ? "text-blue-300" : "text-blue-800"
        }`}>
          Galería de Fotos
        </h2>
        <p className={`text-lg mb-6 transition-colors duration-500 ${
          isDarkMode ? "text-blue-400" : "text-blue-600"
        }`}>
        </p>
        
        <Button
          onClick={() => setShowUploadForm(true)}
          className=" bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 outline-none ring-0 focus:outline-none focus:ring-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 mr-2">
  <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
  <path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
</svg>
 Subir Nueva Foto
        </Button>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className={`text-xl transition-colors duration-500 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Subite una foto que no hay x ahora!
            </p>
          </div>
        ) : (
          photos.map((photo) => (
            <Card 
              key={photo.id}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? "bg-gray-800 border-blue-700" 
                  : "bg-white border-blue-200"
              }`}
            >
              <div className="relative">
                {/* Imagen */}
                <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-300 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                </div>

                {/* Botones de acción (superpuestos) */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-white/80 text-gray-700 hover:bg-white/90 p-2 outline-none ring-0 focus:outline-none focus:ring-0"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = photo.url;
                      link.download = `foto-${photo.id}.jpg`;
                      link.click();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                  </Button>
                  
                  <Button
                    size="sm"
                    className="bg-red-500/80 text-white hover:bg-red-600/90 p-2 outline-none ring-0 focus:outline-none focus:ring-0"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: photo.caption,
                          text: `Foto de ${photo.author}: ${photo.caption}`,
                          url: photo.url,
                        });
                      } else {
                        navigator.clipboard.writeText(photo.url);
                        alert('¡Link copiado al portapapeles!');
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Información de la foto */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-blue-300" : "text-blue-800"
                    }`}>
                      {photo.caption} 🎉
                    </h3>
                    <p className={`text-sm transition-colors duration-500 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}>
                      Por {photo.author}
                    </p>
                    <p className={`text-xs transition-colors duration-500 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {formatDate(photo.created_at)}
                    </p>
                  </div>
                </div>
                
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de subida (SOLO ESTE) */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`max-w-md w-full mx-4 p-6 grid rounded-lg shadow-xl transition-colors duration-500 ${
              isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <div className="grid place-items-center">
            <h3
              className={`text-xl font-bold mb-4 text-center transition-colors duration-500 ${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              
             Subir Nueva Foto
            </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Seleccionar Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={`w-full px-3 py-2 rounded-md border transition-colors duration-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Tu Nombre
                </label>
                <input
                  type="text"
                  value={uploadData.author}
                  onChange={(e) => setUploadData({...uploadData, author: e.target.value})}
                  placeholder="¿Cómo te llamas?"
                  className={`w-full px-3 py-2 rounded-md border transition-colors duration-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Descripción
                </label>
                <textarea
                  value={uploadData.caption}
                  onChange={(e) => setUploadData({...uploadData, caption: e.target.value})}
                  placeholder="Describe tu foto..."
                  rows="3"
                  className={`w-full px-3 py-2 rounded-md border transition-colors duration-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowUploadForm(false)}
                className={`flex-1 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !uploadData.author.trim() || !uploadData.caption.trim() || isUploading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white outline-none ring-0 focus:outline-none focus:ring-0"
              >
                {isUploading ? "Subiendo..." : "Subir Foto"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;