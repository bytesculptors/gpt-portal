import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ThreadModule } from './thread/thread.module';
import { MessageModule } from './message/message.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserModule, ThreadModule, MessageModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
