-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS photo_likes;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS slot_history;

-- Recrear tablas con el nuevo esquema
CREATE TABLE IF NOT EXISTS slot_history (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photos (
    id int PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,  -- Nombre del archivo guardado
    original_name VARCHAR(255) NOT NULL,  -- Nombre original del archivo
    mimetype VARCHAR(100) NOT NULL,  -- Tipo MIME (image/jpeg, image/png, etc.)
    size INTEGER NOT NULL,  -- Tamaño del archivo en bytes
    caption TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photo_likes (
    id int PRIMARY KEY AUTO_INCREMENT,
    photo_id int NOT NULL,
    user_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_photo_user (photo_id, user_hash)
);