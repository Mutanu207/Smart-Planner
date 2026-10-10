import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js'
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/db.config.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
    isGlobal: true,
    load: [databaseConfig],
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}