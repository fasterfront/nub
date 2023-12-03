import { db } from 'db'

const accessTokenQuery = db.query.user
  .findFirst({
    columns: { accessToken: true },
    where: (table, { eq, sql }) => eq(table.id, sql.placeholder('userId')),
  })
  .prepare()

export default function getAccessToken(userId: string) {
  return accessTokenQuery.get({ userId })?.accessToken
}
