import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { ShopsModule } from './shops/shops.module';
import {DatabaseModule} from "./database/database.module";
import { WebhooksModule } from './webhooks/webhooks.module';
import {ShopifyModule} from "./shopify/shopify.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:'.env'
      }),
      AuthModule,
      ShopsModule,
      DatabaseModule,
      WebhooksModule,
      ShopifyModule
  ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
