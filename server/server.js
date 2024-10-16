const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = 3001;

const {db, createToken, key} = require('./database/databaseConnection.js');
const { error } = require('console');

const profilePhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './profilePhotos');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const uploadProfilePhoto = multer({storage: profilePhotoStorage})

app.use(cors());
app.use(bodyParser.json());

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, key, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};

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

app.post('/upload-profile-photo', authToken, uploadProfilePhoto.single('photo'), (req, res) => {
    const userId = req.user.id;
    const filePath = req.file.path;

    const sql = "UPDATE users SET profile_photo_path = ? WHERE id = ?";
    db.run(sql, [filePath, userId], function (err) {
        if (err) {
            return res.status(500).send("Error saving the profile photo path to the database.");
        }
        res.status(200).send("Profile photo uploaded and saved.");
    });
});

app.get('/profile-photo', authToken, (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT profile_photo_path FROM users WHERE id = ?";
    db.get(sql, [userId], (err, row) => {
        if (err || !row || !row.profile_photo_path) {
            console.error(err);
            return res.status(404).send("Profile photo not found.");
        }

        const filePath = row.profile_photo_path;
        res.sendFile(path.resolve(filePath));
    });
});

app.get('/users-status', authToken, (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT users_status_text FROM users WHERE id = ?";
    db.get(sql, [userId], (err, row) => {
        if (err || !row || !row.users_status_text) {
            console.error(err);
            return res.status(404).send("Status not found.");
        }
        
        res.status(200).send(row.users_status_text);
    });
});

app.get('/users-car-desc', authToken, (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT users_car_desc FROM users WHERE id = ?";
    db.get(sql, [userId], (err, row) => {
        if (err || !row || !row.users_car_desc) {
            console.error(err);
            return res.status(404).send("car desc found.");
        }

        res.status(200).send(row.users_car_desc);
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});