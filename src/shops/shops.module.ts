import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Module({
  imports: [
  ],
  providers: [ShopsService],
})
export class ShopsModule {}
