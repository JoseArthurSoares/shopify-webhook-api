import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import {HttpModule} from "@nestjs/axios";
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [HttpModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
