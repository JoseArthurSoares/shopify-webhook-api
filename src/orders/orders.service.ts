import {Inject, Injectable} from '@nestjs/common';
import {ShopsService} from "../shops/shops.service";
import {DATABASE_INSTANCE} from "../database/database.module";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from '../database/schema';
import {OnEvent} from "@nestjs/event-emitter";

@Injectable()
export class OrdersService {
    constructor(
        @Inject(DATABASE_INSTANCE) private readonly db: PostgresJsDatabase<typeof schema>,
        private readonly shopsService: ShopsService
    ) {}

    @OnEvent('order.created')
    async saveOrder(event: any) {
        const {shopDomain, payload} = event;
        const shop = await this.shopsService.findShopByDomain(shopDomain);

        if (!shop) {
            console.log('Loja não encontrada');
            return;
        }

        const orderId = `gid://shopify/Order/${payload.id}`;

        return this.db
            .insert(schema.orders)
            .values({
                id: orderId,
                shop_id: shop.id,
                order_data: payload,
            })
            .onConflictDoUpdate({
                target: schema.orders.id,
                set: { order_data: payload },
            });
    }

    async findAll(){
        return this.db.query.orders.findMany({
            with:{
                shop:{
                    columns:{
                        nome_loja: true
                    }
                }
            }
        })

    }
}
