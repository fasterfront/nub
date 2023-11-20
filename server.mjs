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
