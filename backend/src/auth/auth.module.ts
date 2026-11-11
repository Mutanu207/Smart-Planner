import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthModel } from './auth.model.js';
import { JwtModule} from '@nestjs/jwt'
import { TokenService } from './token.service.js';
import { AuthMiddleware } from './auth.middleware.js';
import { GoogleStrategy } from './google.strategy.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: '15m',
      },
    }),
  }),
],
  controllers: [AuthController],
  providers: [AuthService, AuthModel, TokenService, AuthMiddleware,GoogleStrategy],
})
export class AuthModule {}
