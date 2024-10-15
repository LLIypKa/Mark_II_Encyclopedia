const sqlite = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const { name } = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const dbPath = path.resolve(__dirname, "base.db")
const profilePhotosFolder = './profilePhotos/';
if (!fs.existsSync(profilePhotosFolder)) {
    fs.mkdirSync(profilePhotosFolder);
}

const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных', err.message);
    } else {
        console.log('Подключено к базе данных SQLite');
    }
});

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      profile_photo_path TEXT
    )
  `, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы:', err.message);
        }
    });
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        text_content TEXT NOT NULL,
        author_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы:', err.message);
        }
    });
});

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO users (email, password, name, profile_photo_path) VALUES ('admin@yandex.ru', 'admin34', 'ApaXuc','../Mark_II_Encyclopedia/server/profilePhotos/templateProfilePhoto.jpg')`);
            db.run(`INSERT INTO users (email, password, name, profile_photo_path) VALUES ('callika@yandex.ru', 'admin35', 'LLIypKa','../Mark_II_Encyclopedia/server/profilePhotos/templateProfilePhoto.jpg')`);
            console.log('Тестовые пользователи добавлены');
        }
    });
});

const key = 'XuXuXaXa_MARK_II_B_TToucKax_CTOJl6a';

function createToken(user) {
    const payload = { 
        id: user.id, 
        email: user.email, 
        name: user.name 
    };

    const token = jwt.sign(payload, key, { expiresIn: '1h' })
    return token;
}

module.exports = { db, createToken, key };