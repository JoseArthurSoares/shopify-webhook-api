import {Inject, Injectable} from '@nestjs/common';
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from '../database/schema';
import { v4 as uuidv4 } from 'uuid';
import {DATABASE_INSTANCE} from "../database/database.module";
import {eq} from "drizzle-orm";


@Injectable()
export class ShopsService {

  constructor(@Inject(DATABASE_INSTANCE) private readonly db: PostgresJsDatabase<typeof schema>) {
  }

  async saveShop(nome_loja: string, access_token: string) {
    const newId = uuidv4();

    return this.db
        .insert(schema.shops)
        .values({
          id:newId,
          nome_loja: nome_loja,
          access_token: access_token,
        })
        .onConflictDoUpdate({
            target:schema.shops.nome_loja,
            set: {
                access_token: access_token,
            }
        })
  }

    async findShopByDomain(shopDomain: any): Promise<any> {
        return this.db.query.shops.findFirst({
            where: eq(schema.shops.nome_loja, shopDomain)
        })
    }
}
