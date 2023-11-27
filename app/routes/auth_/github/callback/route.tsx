import { type DataFunctionArgs } from '@remix-run/node'

import {
  authenticator,
  oAuthTypeCookie,
  redirectCookie,
} from 'services/auth.server'

export async function loader({ request }: DataFunctionArgs) {
  const redirectUrl = await redirectCookie.parse(request.headers.get('Cookie'))
  const oAuthType = await oAuthTypeCookie.parse(request.headers.get('Cookie'))

  return await authenticator.authenticate(oAuthType ?? 'github', request, {
    successRedirect: redirectUrl ?? '/',
    failureRedirect: redirectUrl ?? '/',
  })
}
