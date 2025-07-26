import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {HttpModule} from "@nestjs/axios";
import {ShopsModule} from "../shops/shops.module";
import {ShopsService} from "../shops/shops.service";

@Module({
  imports: [
      HttpModule,
      ShopsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,ShopsService],
})
export class AuthModule {}
