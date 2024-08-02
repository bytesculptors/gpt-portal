import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "../message/entities/message.entity";
import { Thread } from "../thread/entities/thread.entity";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                type: 'postgres',
                host: 'localhost',
                database: process.env.NODE_ENV === 'test' ? 'test' : 'postgres',
                username: 'pg',
                password: 'pg',
                port: 5432,
                autoLoadEntities: true,
                entities: [User, Thread, Message],
            })
        })
    ]
})
export class DatabaseModule { }