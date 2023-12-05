import { relations } from 'drizzle-orm'
import {
  foreignKey,
  index,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core'
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

export const userRelations = relations(user, ({ many }) => ({
  organizations: many(organizationUser),
  nubs: many(nub),
  stars: many(nubStar),
}))

export const organization = sqliteTable('organization', {
  id: id().primaryKey(),
  handle: text('handle').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})
export const organizationRelations = relations(organization, ({ many }) => ({
  users: many(organizationUser),
}))

export const organizationUser = sqliteTable(
  'organization_user',
  {
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    role: text('role', { enum: ['admin', 'member'] })
      .notNull()
      .default('member'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.userId] }),
    idxUser: index('idx_organization_user_user').on(table.userId),
    idxOrganization: index('idx_organization_user_organization').on(
      table.organizationId,
    ),
  }),
)
export const organizationUserRelations = relations(
  organizationUser,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationUser.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [organizationUser.userId],
      references: [user.id],
    }),
  }),
)

export const nub = sqliteTable(
  'nub',
  {
    id: id().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    organizationId: text('organization_id').references(() => organization.id),
    handle: text('handle'),
    type: text('type', { enum: ['public', 'secret', 'private'] })
      .notNull()
      .default('public'),
    description: text('description'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    originalNubId: text('original_nub_id'), // when nub is forked
  },
  (table) => ({
    idxUser: index('idx_nub_user').on(table.userId),
    idxOrganization: index('idx_nub_organization').on(table.organizationId),
    unique: unique().on(table.userId, table.handle),
    fkNubNub: foreignKey({
      columns: [table.originalNubId],
      foreignColumns: [table.id],
    }),
  }),
)
export const nubRelations = relations(nub, ({ one, many }) => ({
  user: one(user, {
    fields: [nub.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [nub.organizationId],
    references: [organization.id],
  }),
  stars: many(nubStar),
  forks: many(nub, { relationName: 'forkedFrom' }),
  forkedFrom: one(nub, {
    fields: [nub.originalNubId],
    references: [nub.id],
    relationName: 'forkedFrom',
  }),
  files: many(file),
  revisions: many(revision),
}))

export const nubStar = sqliteTable(
  'nub_star',
  {
    nubId: text('nub_id')
      .notNull()
      .references(() => nub.id),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.nubId, table.userId] }),
    idxUser: index('idx_nub_stars_user').on(table.userId),
  }),
)
export const nubStarRelations = relations(nubStar, ({ one }) => ({
  nub: one(nub, {
    fields: [nubStar.nubId],
    references: [nub.id],
  }),
  user: one(user, {
    fields: [nubStar.userId],
    references: [user.id],
  }),
}))

export const file = sqliteTable(
  'file',
  {
    id: id().primaryKey(),
    nubId: text('nub_id')
      .notNull()
      .references(() => nub.id),
    name: text('name').notNull(),
    content: text('content').notNull(),
  },
  (table) => ({
    idxNub: index('idx_file_nub').on(table.nubId),
  }),
)
export const fileRelations = relations(file, ({ one }) => ({
  nub: one(nub, {
    fields: [file.nubId],
    references: [nub.id],
  }),
}))

export const revision = sqliteTable(
  'revision',
  {
    id: createdAt('id').primaryKey(),
    nubId: text('nub_id')
      .notNull()
      .references(() => nub.id),
  },
  (table) => ({
    idxNub: index('idx_revision_nub').on(table.nubId),
  }),
)
export const revisionRelations = relations(revision, ({ one, many }) => ({
  nub: one(nub, {
    fields: [revision.nubId],
    references: [nub.id],
  }),
  files: many(revisionFile),
}))

export const revisionFile = sqliteTable(
  'revision_file',
  {
    revisionId: text('revision_id')
      .notNull()
      .references(() => revision.id),
    fileId: text('file_id')
      .notNull()
      .references(() => file.id),
    content: text('content').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.revisionId, table.fileId] }),
  }),
)
export const revisionFileRelations = relations(revisionFile, ({ one }) => ({
  revision: one(revision, {
    fields: [revisionFile.revisionId],
    references: [revision.id],
  }),
  file: one(file, {
    fields: [revisionFile.fileId],
    references: [file.id],
  }),
}))
