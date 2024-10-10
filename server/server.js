const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const PORT = 3001;

const {db, createToken} = require('./database/databaseConnection.js');

app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const sql = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";

    db.run(sql, [email, password, name], function (err) {
        if (err) {
            console.log(email + ' ' + password + ' ' + name)
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
        
        const token = createToken(user)
        res.status(200).send({ message: "Login successful", token, user });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});