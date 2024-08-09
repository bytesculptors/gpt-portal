import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "../message/entities/message.entity";
import { Thread } from "../thread/entities/thread.entity";
import { User } from "../user/entities/user.entity";
import 'dotenv/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                type: process.env.DB_TYPE as 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mongodb' | 'oracle' | 'mssql',
                host: process.env.DB_HOST,
                database: process.env.NODE_ENV === process.env.DB_TEST ? process.env.DB_TEST : process.env.DB_NAME,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                port: parseInt(process.env.DB_PORT),
                autoLoadEntities: true,
                entities: [User, Thread, Message],
            })
        })
    ]
})
export class DatabaseModule { }