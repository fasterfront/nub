/**
 * Replays a GET request on the primary region when a request is made to a
 * read-replica region. Fly.io already replays non-GET requests, but sometimes
 * we need to do it when the request is a GET (e.g. for oAuth callbacks).
 * @returns
 */
export function ensurePrimaryRegion() {
  if (process.env.FLY_REGION === process.env.PRIMARY_REGION) return

  throw new Response(null, {
    headers: { 'fly-replay': `region=${process.env.PRIMARY_REGION}` },
  })
}
