import { useRouteLoaderData } from '@remix-run/react'
import { type loader } from 'routes/layout'

export default function useUser() {
  return useRouteLoaderData<typeof loader>('routes/layout')?.user
}
