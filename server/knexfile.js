const path = require('path');
require('dotenv').config(); 

module.exports = {
    development: {
        client: 'pg',
        connection: {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        },
        migrations: {
            directory: path.join(__dirname, 'database/migrations'),
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: path.join(__dirname, 'database/seeds')
        }
    }
}