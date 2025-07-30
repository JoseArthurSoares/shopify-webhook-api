import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { ShopsModule } from './shops/shops.module';
import {DatabaseModule} from "./database/database.module";
import { WebhooksModule } from './webhooks/webhooks.module';
import {ShopifyModule} from "./shopify/shopify.module";
import { OrdersService } from './orders/orders.service';
import {ShopsService} from "./shops/shops.service";
import {EventEmitterModule} from "@nestjs/event-emitter";
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
      EventEmitterModule.forRoot(),
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
    controllers: [AppController, OrdersController],
    providers: [AppService, OrdersService, ShopsService],
})
export class AppModule {}
