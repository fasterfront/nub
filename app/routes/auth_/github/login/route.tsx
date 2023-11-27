import { redirect, type DataFunctionArgs } from '@remix-run/node'

import {
  authenticator,
  oAuthTypeCookie,
  redirectCookie,
} from 'services/auth.server'

export function loader() {
  return redirect('/')
}

export async function action({ request }: DataFunctionArgs) {
  const url = new URL(request.url)
  const redirectUrl = request.headers.get('referer') || '/'
  const oAuthType = url.searchParams.get('type') ?? 'github'

  try {
    return await authenticator.authenticate(oAuthType, request, {
      successRedirect: redirectUrl,
      failureRedirect: redirectUrl,
    })
  } catch (error) {
    if (error instanceof Response) {
      error.headers.append(
        'Set-Cookie',
        await redirectCookie.serialize(redirectUrl),
      )
      error.headers.append(
        'Set-Cookie',
        await oAuthTypeCookie.serialize(oAuthType),
      )
    }
    throw error
  }
}
