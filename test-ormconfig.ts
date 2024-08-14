import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config'

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_TEST,
  entities: ['./src/**/entities/*.entity.ts'],
  migrations: ['dist/migrations/**/*.js']
}

export const setUp = async () => {
  const testDataSource = await new DataSource({
    ...dataSourceOptions,
    database: process.env.DB_NAME
  }).initialize()
  const qr = testDataSource.createQueryRunner()
  await qr.dropDatabase(dataSourceOptions.database, true)
  await qr.createDatabase(dataSourceOptions.database, true)
  await qr.release()
  await testDataSource.destroy()

  const seedConn = await new DataSource({
    ...dataSourceOptions
  }).initialize()
  await seedConn.runMigrations()
}