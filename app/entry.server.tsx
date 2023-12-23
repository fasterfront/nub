import { renderToReadableStream } from 'react-dom/server.edge'
import { type EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'

import isbot from 'isbot'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(err) {
        responseStatusCode = 500
        console.error(err)
      },
    },
  )

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html; charset=utf-8')
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
