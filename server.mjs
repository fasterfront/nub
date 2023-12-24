import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

import { createRequestHandler } from '@remix-run/express'
import express from 'express'
import logger from 'pino-http'

const numCPUs =
  process.env.NODE_ENV === 'production' ? os.availableParallelism() : 1

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  await startServer()
}

async function startServer() {
  const vite =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then(({ createServer }) =>
          createServer({ server: { middlewareMode: true } }),
        )

  const app = express()
  app.disable('x-powered-by')
  app.use(permanentRedirects)

  if (vite) {
    app.use(vite.middlewares)
  } else {
    app.use(
      '/assets',
      express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
    )
  }

  app.use(logger())

  app.all(
    '*',
    createRequestHandler({
      build: vite
        ? () => vite.ssrLoadModule('virtual:remix/server-build')
        : await import('./build/server/index.js'),
    }),
  )

  const port = process.env.PORT ?? 3000
  app.listen(port, '0.0.0.0', () =>
    console.log('Server started on http://localhost:' + port),
  )
}

// --
function permanentRedirects(req, res, next) {
  let { path, url, headers } = req
  let { host, 'x-forwarded-proto': protocol } = headers

  if (protocol === 'https') {
    res.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    )
  }

  if (
    (protocol !== 'http' || host.startsWith('localhost')) && // upgrade to https
    !host.startsWith('www.') && // redirect www to non-www
    (!path.endsWith('/') || path.length === 1) && // remove trailing slash
    !path.includes('//') // remove double slashes
  ) {
    return next()
  }

  if (protocol === 'http' && !host.startsWith('localhost')) {
    protocol = 'https'
    res.set('X-Forwarded-Proto', 'https')
  }
  if (host.startsWith('www.')) {
    host = host.slice(4)
  }

  const query = url.slice(path.length)
  const safepath = path.slice(0, -1).replace(/\/+/g, '/')
  res.redirect(308, `${protocol}://${host}${safepath}${query}`)
}
