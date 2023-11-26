import { createId } from '@paralleldrive/cuid2'
import { text } from 'drizzle-orm/sqlite-core'

export const id = (name = 'id') => text(name).notNull().$default(createId)

export const createdAt = (name = 'created_at') =>
  text(name)
    .notNull()
    .$default(() => new Date().toISOString())

export const updatedAt = (name = 'updated_at') => createdAt(name)
