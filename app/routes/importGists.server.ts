import getAccessToken from './getAccessToken.server'

export async function getGistsForImports(userId: string) {
  const accessToken = getAccessToken(userId)

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      query: GistsQuery,
    }),
  })

  const { data } = (await resp.json()) as GistsQueryResponse

  return data.viewer.gists.nodes
}

const GistsQuery = `query {
  viewer {
    gists(first: 100) {
      nodes {
        name
        description
        files {
          name
          text
        }
      }
    }
  }
}`

type GistsQueryResponse = {
  data: {
    viewer: {
      gists: {
        nodes: {
          name: string
          description: string
          files: {
            name: string
            text: string
          }[]
        }[]
      }
    }
  }
}
