const express = require("express");
const knex = require('knex');
const knexConfig = require('./knexfile');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT;
const db = knex(knexConfig.development);

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