import {Inject, Injectable} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from '../database/schema';
import { v4 as uuidv4 } from 'uuid';
import {DATABASE_INSTANCE} from "../database/database.module";


@Injectable()
export class ShopsService {

  constructor(@Inject(DATABASE_INSTANCE) private readonly db: PostgresJsDatabase<typeof schema>) {
  }

  async saveShop(shopDto: CreateShopDto) {
    const newId = uuidv4();

    return this.db
        .insert(schema.shops)
        .values({
          id:newId,
          nome_loja: shopDto.nome_loja,
          access_token: shopDto.access_token,
        })
        .onConflictDoNothing();
  }
}
