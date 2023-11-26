import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import express from 'express'

installGlobals()

const {
  unstable_createViteServer: createViteServer,
  unstable_loadViteServerBuild: loadViteServerBuild,
} = process.env.NODE_ENV === 'development' ? await import('@remix-run/dev') : {}

const vite = await createViteServer?.()

const app = express()
app.use(permanentRedirects)

if (vite) {
  app.use(vite.middlewares)
} else {
  app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
  )
}
app.use(express.static('public', { maxAge: '1h' }))

app.all(
  '*',
  createRequestHandler({
    build: vite
      ? () => loadViteServerBuild(vite)
      : await import('./build/index.js'),
  }),
)

const port = process.env.PORT ?? 3000
app.listen(port, '0.0.0.0', () =>
  console.log('Server started on http://localhost:' + port),
)

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
