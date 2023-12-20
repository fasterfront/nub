import { type LoaderFunctionArgs } from '@remix-run/node'

import {
  authenticator,
  oAuthTypeCookie,
  redirectCookie,
} from 'services/auth.server'
import { ensurePrimaryRegion } from 'services/http.server'

export async function loader({ request }: LoaderFunctionArgs) {
  ensurePrimaryRegion()

  const redirectUrl = await redirectCookie.parse(request.headers.get('Cookie'))
  const oAuthType = await oAuthTypeCookie.parse(request.headers.get('Cookie'))

  return await authenticator.authenticate(oAuthType ?? 'github', request, {
    successRedirect: redirectUrl ?? '/',
    failureRedirect: redirectUrl ?? '/',
  })
}
