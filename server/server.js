const express = require("express");
const knex = require('knex');
const knexConfig = require('./database/database_connection');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT;

async function startServer() {
    try {
        const db = knex(knexConfig.development);
        console.log('Checking database connection and migrations');

        await db.raw('SELECT 1');
        console.log('Database connection enabled');

        await db.migrate.latest();
        console.log('Database migrations completed');

        await db.destroy();

        app.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();