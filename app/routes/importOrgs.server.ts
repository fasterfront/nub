import { db } from 'db'
import { organization, organizationUser, user } from 'db/schema'
import getAccessToken from './getAccessToken.server'

export async function getOrganizationsForImport(userId: string) {
  const accessToken = getAccessToken(userId)

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ query: OrgsQuery }),
  })
  const { data } = (await resp.json()) as OrgsQueryResponse

  return data.viewer.organizations.nodes.map((org) => ({
    name: org.name,
    handle: org.login,
    avatar: org.avatarUrl,
    users: org.membersWithRole.edges.map(({ node, role }) => ({
      handle: node.login,
      name: node.name,
      email: node.email || null,
      avatar: node.avatarUrl,
      role: role.toLowerCase() as Lowercase<typeof role>,
    })),
  }))
}

type OrganizationList = Awaited<ReturnType<typeof getOrganizationsForImport>>

export function importOrgs(allOrgs: OrganizationList, orgHandles: string[]) {
  const orgs = allOrgs.filter((org) => orgHandles.includes(org.handle))
  const users = orgs.flatMap((org) => org.users)

  db.transaction((tr) => {
    tr.insert(organization).values(orgs).onConflictDoNothing().run()
    tr.insert(user).values(users).onConflictDoNothing().run()

    const orgIds = tr.query.organization
      .findMany({
        columns: { id: true, handle: true },
        where: (table, { inArray }) =>
          inArray(
            table.handle,
            orgs.map((o) => o.handle),
          ),
      })
      .prepare()
      .all()

    const userIds = tr.query.user
      .findMany({
        columns: { id: true, handle: true },
        where: (table, { inArray }) =>
          inArray(
            table.handle,
            users.map((u) => u.handle),
          ),
      })
      .prepare()
      .all()

    tr.insert(organizationUser)
      .values(
        orgs.flatMap((org) => {
          const organizationId = orgIds.find((o) => o.handle === org.handle)!.id
          return org.users.map((user) => {
            const userId = userIds.find((u) => u.handle === user.handle)!.id
            return {
              organizationId,
              userId,
              role: user.role,
            }
          })
        }),
      )
      .onConflictDoNothing()
      .run()
  })
}

const OrgsQuery = `query {
  viewer {
    organizations(first: 50) {
      nodes {
        login
        name
        avatarUrl
        membersWithRole(first: 100) {
          edges {
            node {
              login
              name
              email
              avatarUrl
            }
            role
          }
        }
      }
    }
  }
}`

type OrgsQueryResponse = {
  data: {
    viewer: {
      organizations: {
        nodes: {
          login: string
          name: string
          avatarUrl: string
          membersWithRole: {
            edges: {
              node: {
                login: string
                name: string
                email: string
                avatarUrl: string
              }
              role: 'MEMBER' | 'ADMIN'
            }[]
          }
        }[]
      }
    }
  }
}
