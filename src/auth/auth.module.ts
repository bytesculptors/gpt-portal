import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../constant/jwtSecret';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '2d' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
