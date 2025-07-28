import { Module, LoggerService  } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [HttpModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
