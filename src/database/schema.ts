import {jsonb, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const shops = pgTable('shops', {
    id: uuid('id').primaryKey(),
    nome_loja: text('nome_loja').notNull().unique(),
    access_token: text('access_token').notNull(),
    connected_at: timestamp('connected_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
})

export const orders = pgTable('orders', {
    id: text('id').primaryKey(),
    shop_id: uuid('shop_id').notNull().references(() => shops.id),
    order_data: jsonb('order_data').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
    shop: one(shops, {
        fields: [orders.shop_id],
        references: [shops.id],
    }),
}));

export const shopsRelations = relations(shops, ({ many }) => ({
    orders: many(orders),
}));