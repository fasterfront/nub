import { sql } from 'drizzle-orm'
import { db } from 'db'

const nubsQuery = db.query.nub
  .findMany({
    columns: {
      id: true,
      handle: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    extras: {
      totalCount: sql`count(*) over()`.as('total_count'),
    },
    with: {
      user: {
        columns: {
          id: true,
          handle: true,
          name: true,
          avatar: true,
        },
      },
      forks: {
        columns: {
          id: true,
          handle: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              handle: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      stars: {
        columns: {
          userId: true,
        },
      },
      forkedFrom: {
        columns: {
          id: true,
          handle: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              handle: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      files: {
        columns: {
          id: true,
          name: true,
          content: true,
        },
        limit: 1,
        orderBy: (file, { asc, sql }) =>
          sql`case when lower(${
            file.name
          }) = 'readme.md' then 0 else 1 end asc, ${asc(file.name)}`,
      },
    },
    limit: sql.placeholder('limit'),
    offset: sql.placeholder('offset'),
    where: (nub, { eq }) => eq(nub.type, 'public'),
    orderBy: (nub, { desc }) => desc(nub.createdAt),
  })
  .prepare()

export default function getPublicNubs({ limit = 10, offset = 0 }) {
  return nubsQuery.all({ limit, offset })
}
