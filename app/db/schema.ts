import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createdAt, id, updatedAt } from './customTypes'

export const user = sqliteTable('user', {
  id: id().primaryKey(),
  handle: text('handle').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').unique(), // can be null when importing org from GitHub
  avatar: text('avatar'),
  accessToken: text('access_token'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})
