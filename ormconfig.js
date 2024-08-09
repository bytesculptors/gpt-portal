const { DataSource } = require("typeorm");
// import 'dotenv/config'
require('dotenv').config()

module.exports = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    entities: ['dist/**/*.entity.js'],
    migrationsTableName: 'migration_table',
    migrations: ['dist/migrations/**/*.js'],
    synchronize: false,
    cli: {
        migrationsDir: 'src/migrations'
    }
})