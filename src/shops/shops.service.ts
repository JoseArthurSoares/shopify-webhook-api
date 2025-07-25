import {Inject, Injectable} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from '../db/schema'

@Injectable()
export class ShopsService {

  constructor(@Inject() private readonly db: PostgresJsDatabase<typeof schema>) {
  }

  async saveShop(shopDto: CreateShopDto) {
    return this.db
        .insert(schema.shops)
        .values(shopDto)
        .onConflictDoNothing();
  }
}
