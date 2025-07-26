import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { ShopsModule } from './shops/shops.module';
import {DatabaseModule} from "./database/database.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:'.env'
      }),
      AuthModule,
      ShopsModule,
      DatabaseModule
  ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
