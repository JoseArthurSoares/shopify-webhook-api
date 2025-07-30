import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {HttpModule} from "@nestjs/axios";
import {ShopsModule} from "../shops/shops.module";
import {ShopsService} from "../shops/shops.service";
import {WebhooksService} from "../webhooks/webhooks.service";

@Module({
  imports: [
      HttpModule,
      ShopsModule,
  ],
  controllers: [AuthController],
  providers: [
      ShopsService,
      WebhooksService
  ],
})
export class AuthModule {}
