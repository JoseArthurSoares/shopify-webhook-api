import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Module({
  providers: [ShopsService],
})
export class ShopsModule {}
