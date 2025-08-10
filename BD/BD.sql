CREATE TABLE IF NOT EXISTS slot_history (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photos (
    id int PRIMARY KEY AUTO_INCREMENT,
    url TEXT NOT NULL,
    caption TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photo_likes (
    id int PRIMARY KEY AUTO_INCREMENT,
    photo_id int NOT NULL,
    user_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_photo_user (photo_id, user_hash)
);