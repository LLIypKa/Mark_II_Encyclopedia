const sqlite = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, "base.db")
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
      name TEXT NOT NULL
    )
  `, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы:', err.message);
        }
    });
});

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO users (email, password, name) VALUES ('admin@yandex.ru', 'admin34', 'ApaXuc')`);
            db.run(`INSERT INTO users (email, password, name) VALUES ('callika@yandex.ru', 'admin35', 'LLIypKa')`);
            console.log('Тестовые пользователи добавлены');
        }
    });
});

module.exports = db;