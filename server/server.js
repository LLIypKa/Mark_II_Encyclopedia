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
const { getEventListeners } = require('events');
app.use('/usersCarsPhotos', express.static('usersCarsPhotos'));
app.use('/profilePhotos', express.static('profilePhotos'));
app.use('/usersCarsPhotos', express.static('usersCarsPhotos'));
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const isProfilePhoto = file.fieldname === 'profilePhoto';
            const uploadPath = isProfilePhoto ? 'profilePhotos' : 'usersCarsPhotos';
            cb(null, path.join(__dirname, uploadPath));
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}${ext}`;
            cb(null, filename);
        },
    }),
});

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

app.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'usersCarsPhotos', maxCount: 10 }, // Укажите максимум файлов
]), (req, res) => {
    const { email, password, name, status, car_desc } = req.body;
    console.log(req);
    console.log("\n\n" + res);
    let profile_photo_path = null;
    if (req.files['profilePhoto'] && req.files['profilePhoto'].length > 0) {
        profile_photo_path = path.posix.join('profilePhotos', req.files['profilePhoto'][0].filename); // Путь к загруженному фото
        profile_photo_path = profile_photo_path.substring(0, profile_photo_path.length);
    }
    const sql = "INSERT INTO users (email, password, name, users_status_text, users_car_desc, profile_photo_path) VALUES (?, ?, ?, ?, ?, ?)";

    db.run(sql, [email, password, name, status, car_desc, profile_photo_path], function (err) {
        if (err) {
            console.log(email + ' ' + password + ' ' + name + ' ' + status + ' ' + car_desc);
            return res.status(400).send("User already exists or invalid input.");
        }
        if (req.files['usersCarsPhotos'] && req.files['usersCarsPhotos'].length > 0) {
            const carPhotosSql = `
                        INSERT INTO car_desc_photos (users_id, photo_path) VALUES (?, ?)
                    `;
            const carPhotos = req.files['usersCarsPhotos'];

            const carPhotoInsertions = carPhotos.map((file) => {
                const photoPath = path.posix.join('usersCarsPhotos', file.filename);
                return new Promise((resolve, reject) => {
                    db.run(carPhotosSql, [this.lastID, photoPath], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            Promise.all(carPhotoInsertions)
                .then(() => res.status(201).send({ id: this.lastID, email }))
                .catch((error) => {
                    console.error(`Ошибка при сохранении фотографий машин: ${error.message}`);
                    res.status(500).send("Ошибка при сохранении фотографий машин.");
                });
        } else {
            res.status(201).send({ id: this.lastID, email });
        }
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

/*app.post('/upload-profile-photo', authToken, uploadProfilePhoto.single('profilePhoto'), (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ message: 'Фото профиля не загружено' });
    }

    const filePath = req.file.path;

    const sql = "UPDATE users SET profile_photo_path = ? WHERE id = ?";
    db.run(sql, [filePath, userId], function (err) {
        if (err) {
            return res.status(500).send("Error saving the profile photo path to the database.");
        }
        res.status(200).send("Profile photo uploaded and saved.");
    });
});*/

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
    });
});
app.use('/usersStatusPhotos', express.static(path.join(__dirname, 'usersStatusPhotos')));
app.get('/get-status-photos', authToken, (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT photo_path FROM users_status_photos WHERE user_id = ?";
    db.all(sql, [userId], (err, rows) => {
        if (err || !rows.length) {
            console.error(err);
            return res.status(404).send("Status photos not found.");
        }

        let photos = [];
        for (let row in rows) {
            photos.push(row.photo_path);
            console.log()
        }
        res.status(200).send({ photos });
    });
});

app.get('/get-car-desc-photos', authToken, (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT photo_path FROM car_desc_photos WHERE users_id = ?";
    db.all(sql, [userId], (err, rows) => {
        if (err || !rows.length) {
            console.error(err);
            return res.status(404).send("Car description photos not found.");
        }

        const photos = rows.map(row => row.photo_path);
        res.status(200).send({ photos });
    });
});

app.get('/articles/summary-top-3', authToken, (req, res) => {
    try {
        const sql = `SELECT id, title FROM articles ORDER BY created_at DESC LIMIT 3`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send({ error: 'Ошибка сервера. Последние статьи не загрузились. Попробуйте позже.' });
            } else {
                res.status(200).json(rows);
            }
        });
    } catch (error) {
        console.error(`Ошибка при получении списка статей: ${error.message}`);
        res.status(500).send({ error: 'Ошибка сервера. Последние статьи не загрузились. Попробуйте позже.' });
    }
});  

app.get('/articles/:id', authToken, (req, res) => {
    const { id } = req.params;
    const sql = `SELECT id, title, text_content, author_id, created_at FROM articles WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ error: 'Ошибка сервера. Попробуйте позже.' });
        } else if (!row) {
            res.status(404).send({ error: 'Статья не найдена' });
        } else {
            console.log(row);
            res.status(200).json(row);
        }
    });
});

app.get('/user-name-by-id/:id', authToken, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT name FROM users WHERE id = ?";

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({error: "Ошибка при получении данных автора"});
        } else if (!row) {
            res.status(404).send({error: "Ошибка"});
        }
        else {
            console.log(row);
            res.status(200).json(row);
        }
    })
})

app.get('/get-comments-for-article/:articleId', authToken, (req, res) => {
    const articleId = req.params.articleId;

    const sql = `
        SELECT comments.id, comments.text_content, comments.created_at,
               users.name AS author_name, comments.parent_comment_id
        FROM comments
        JOIN users ON comments.author_id = users.id
        WHERE comments.article_id = ?;
    `;

    db.all(sql, [articleId], (err, rows) => {
        if (err) {
            console.error('Ошибка при получении комментариев:', err.message);
            return res.status(500).send({ error: 'Ошибка при получении комментариев' });
        }

        if (rows.length === 0) {
            return res.status(404).send({ error: 'Комментарии не найдены' });
        }

        const commentsWithAuthors = rows.map(row => ({
            id: row.id,
            content: row.text_content,
            date: row.created_at,
            authorName: row.author_name,
            parentCommentId: row.parent_comment_id
        }));

        console.log(commentsWithAuthors);
        res.status(200).json(commentsWithAuthors);
    });
});

app.post('/save-comment-to-article/:articleId', authToken, (req, res) => {
    const {content, date} = req.body;
    const articleId = req.params.articleId;

    console.log("content:", content);
    console.log("date:", date);
    console.log("articleId:", articleId);

    if (!content || content.trim().length === 0) {
        return res.status(400).send({ error: 'Комментарий не может быть пустым' });
    }

    let sql = "INSERT INTO comments(article_id, author_id, text_content, created_at) VALUES (?, ?, ?, ?)";

    db.run(sql, [articleId, req.user.id, content, date], (err, row) => {
        if (err) {
            console.log("Ошибка при сохранении данных\n" + err.message);
            res.status(500).send({ error: 'Ошибка сервера. Попробуйте позже.' });
        }
        else {
            res.status(200).send();
        }
    });
});

app.post('/create-article', authToken, (req, res) => {
    const { newArticleTitle, newArticleContent, date } = req.body;

    console.log("Создание статьи");
    console.log("Title " + newArticleTitle);
    console.log("Content " + newArticleContent);

    let sql = "INSERT INTO articles(title, text_content, author_id, created_at) VALUES (?, ?, ?, ?)";

    db.run(sql, [newArticleTitle, newArticleContent, req.user.id, date], (err, row) => {
        if (err) {
            console.log("Ошибка при сохранении статьи\n" + err.message);
            res.status(500).send({ error: 'Ошиюка сервера. Попробуйте позже' });
        } else {
            res.status(200).send();
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});