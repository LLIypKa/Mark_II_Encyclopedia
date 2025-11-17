const express = require("express");
const knex = require('knex');
const knexConfig = require('./knexfile');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT;
const db = knex(knexConfig.development);

app.use(express.json());
app.use(cors());
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/articles', require('./routes/ArticlesRoutes'));
app.use('/api/comments', require('./routes/CommentRoutes'));

app.use('/usersStatusPhotos', express.static(path.join(__dirname, 'usersStatusPhotos')));
app.use('/profilePhotos', express.static(path.join(__dirname, 'profilePhotos')));
app.use('/usersCarsPhotos', express.static(path.join(__dirname, 'usersCarsPhotos')));

async function startServer() {
    try {
        console.log('Checking database connection and migrations');

        await db.raw('SELECT 1');
        console.log('Database connection enabled');

        await db.migrate.latest();
        console.log('Database migrations completed');

        app.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

module.exports = { app, db };
startServer();