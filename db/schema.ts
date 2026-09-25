import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  productId: text('product_id'),
  productName: text('product_name'),
  message: text('message').notNull(),
  status: text('status').notNull().default('baru'),
  note: text('note').notNull().default(''),
  notificationStatus: text('notification_status').notNull().default('menunggu-konfigurasi'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (table) => [index('idx_inquiries_created_at').on(table.createdAt), index('idx_inquiries_status_created_at').on(table.status, table.createdAt)]);
