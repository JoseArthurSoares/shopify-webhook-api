import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";

export const shops = pgTable('shops', {
    id: uuid('id').primaryKey(),
    nome_loja: text('nome_loja').notNull().unique(),
    access_token: text('access_token').notNull(),
    connected_at: timestamp('connected_at').defaultNow()
})