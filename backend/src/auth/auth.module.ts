import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthModel } from './auth.model.js';
import { JwtModule} from '@nestjs/jwt'
import { TokenService } from './token.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthModel, TokenService]
})
export class AuthModule {}
