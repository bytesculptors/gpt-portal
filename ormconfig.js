const { DataSource } = require("typeorm");

module.exports = new DataSource({
    type: 'postgres',
    username: 'pg',
    password: 'pg',
    port: 5432,
    database: 'postgres',
    host: 'localhost',
    entities: ['dist/**/*.entity.js'],
    migrationsTableName: 'migration_table',
    migrations: ['dist/migrations/**/*.js'],
    synchronize: false,
    cli: {
        migrationsDir: 'src/migrations'
    }
})