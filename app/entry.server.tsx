import { PassThrough } from 'node:stream'

import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { type EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'

import isbot from 'isbot'

React.useLayoutEffect = React.useEffect

const ABORT_DELAY = 5000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false

    const onReady = isbot(request.headers.get('user-agent'))
      ? 'onAllReady'
      : 'onShellReady'

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [onReady]() {
          const body = new PassThrough()
          responseHeaders.set('Content-Type', 'text/html; charset=utf-8')

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(err) {
          reject(err)
          console.error(err)
        },
        onError(err) {
          didError = true
          console.error(err)
        },
      },
    )

    AbortSignal.timeout(ABORT_DELAY).addEventListener('abort', abort)
  })
}
