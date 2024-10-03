const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const PORT = 3001;

const dbPath = path.resolve(__dirname, "database/base.db")
const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных', err.message);
    } else {
        console.log('Подключено к базе данных SQLite');
    }
});

app.use(cors());
app.use(bodyParser.json());

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

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.run(sql, [email, password], function (err) {
        if (err) {
            return res.status(400).send("User already exists or invalid input.");
        }
        res.status(201).send({ id: this.lastID, email });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err || !user) {
            return res.status(400).send("Invalid password or email.");
        }

        // Здесь просто проверяем пароли
        if (user.password !== password) {
            return res.status(400).send("Invalid password or email.");
        }

        res.status(200).send({ message: "Login successful", user });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});