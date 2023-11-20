import 'requestidlecallback'

import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'

requestIdleCallback(() => {
  startTransition(() => {
    // Remove FB/IG embedded browsers injection:
    // https://krausefx.com/blog/ios-privacy-instagram-and-facebook-can-track-anything-you-do-on-any-website-in-their-in-app-browser
    document
      .querySelectorAll('script[src*="connect.facebook"]')
      .forEach((el) => el.remove())

    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    )
  })
})
