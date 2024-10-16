const sqlite = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const { name } = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const dbPath = path.resolve(__dirname, "base.db")
const profilePhotosFolder = '/profilePhotos/';
if (!fs.existsSync(profilePhotosFolder)) {
    fs.mkdirSync(profilePhotosFolder);
}
const usersStatusPhotos = '/usersStatusPhotos/';
if (!fs.existsSync(usersStatusPhotos)) {
    fs.mkdirSync(usersStatusPhotos);
}
const usersCarsPhotos = '/usersCarsPhotos/';
if (!fs.existsSync(usersCarsPhotos)) {
    fs.mkdirSync(usersCarsPhotos);
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
      profile_photo_path TEXT,
      users_status_text TEXT,
      users_car_desc TEXT
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
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        text_content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        parent_comment_id INTEGER,
        FOREIGN KEY (author_id) REFERENCES users(id),
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
    )`, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы:', err.message);
        }
    });
});

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users_status_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      photo_path TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы:', err.message);
        }
    });
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS car_desc_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            users_id INTEGER NOT NULL,
            photo_path TEXT NOT NULL,
            FOREIGN KEY (users_id) REFERENCES users(id) 
        )`,
    (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы:', err.message);
        }
    });
})

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (row.count === 0) {
            const userDesc = 'Мой \'последний самурай\': \n 1jz-gte (турбина, 280 л.с.), диски - \“Крутые диски\”';
            db.run(`INSERT INTO users (email, password, name, profile_photo_path, users_status_text, users_car_desc) VALUES (?, ?, ?, ?, ?, ?)`,
                ['admin@yandex.ru', 'admin34', 'ApaXuc', '../Mark_II_Encyclopedia/server/profilePhotos/templateProfilePhoto.jpg', 'Несколько раз намотался на столб =)', userDesc],
                (err) => {
                    if (err) {
                        console.error('Ошибка при добавлении данных в таблицу users:', err.message);
                    } else {
                        console.log('Пользователь успешно добавлен');
                    }
            });
            db.run(`INSERT INTO users (email, password, name, profile_photo_path, users_status_text, users_car_desc) 
            VALUES (?, ?, ?, ?, ?, ?)`,
                ['callika@yandex.ru', 'admin35', 'LLIypKa', '../Mark_II_Encyclopedia/server/profilePhotos/templateProfilePhoto.jpg',
                    'Ни столба тебе, ни жезла, самурай', userDesc],
                (err) => {
                    if (err) {
                        console.error('Ошибка при добавлении данных в таблицу users:', err.message);
                    } else {
                        console.log('Пользователь успешно добавлен');
                    }
                });
            console.log('Тестовые пользователи добавлены');
        }
    });
});

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM articles", (err, rows) => {
        if (rows.count == 0) {
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.run(`INSERT INTO articles (title, text_content, author_id, created_at) VALUES ('Приветствие', 'ХИХИХАХА, марк 2 в поисках столба', 1, '${currentDate}')`);
            db.run(`INSERT INTO articles (title, text_content, author_id, created_at) VALUES ('Напутствие', 'У самурая нет цели - есть только путь', 2, '${currentDate}')`);
            console.log('Тестовые статьи добавлены');
        }
    });
});

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM comments", (err, rows) => {
        if (rows.count == 0) {
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.run(`INSERT INTO comments (article_id, author_id, text_content, created_at) VALUES (1, 2, 'Столб найден', '${currentDate}')`);
            db.run(`INSERT INTO comments (article_id, author_id, text_content, created_at) VALUES (2, 1, 'Ведь путь самурая - это, по сути, его цель? Не так ли?', '${currentDate}')`);
            console.log('Тестовые комментарии добавлены');
        }
    });
});

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM car_desc_photos", (err, rows) => {
        if (rows.count == 0) {
            db.run(`INSERT INTO car_desc_photos (users_id, photo_path) VALUES (1, '../Mark_II_Encyclopedia/server/usersStatusPhotos/templateStatusPhoto.jpg')`);
            db.run(`INSERT INTO car_desc_photos (users_id, photo_path) VALUES (2, '../Mark_II_Encyclopedia/server/usersStatusPhotos/templateStatusPhoto.jpg')`);
            console.log('Тестовые фото для машин добавлены');
        }
    });
});

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM users_status_photos", (err, rows) => {
        if (rows.count == 0) {
            db.run(`INSERT INTO users_status_photos (user_id, photo_path) VALUES (1, '../Mark_II_Encyclopedia/server/usersStatusPhotos/templateStatusPhoto.jpg')`);
            db.run(`INSERT INTO users_status_photos (user_id, photo_path) VALUES (2, '../Mark_II_Encyclopedia/server/usersStatusPhotos/templateStatusPhoto.jpg')`);
            console.log('Тестовые фото для статусов добавлены');
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