import { useCallback } from 'react'
import { type SerializeFrom, type LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { type Key, RouterProvider } from 'react-aria'

import Avatar from 'components/atoms/Avatar'
import Button from 'components/atoms/Button'
import Dropdown, {
  DropdownMenu,
  DropdownMenuItem,
  DropdownPopover,
} from 'components/atoms/Dropdown'
import Link from 'components/atoms/Link'
import Logo from 'components/atoms/Logo'
import Separator from 'components/atoms/Separator'
import GitHubIcon from 'components/icons/GitHubIcon'
import LogoutIcon from 'components/icons/LogoutIcon'
import { authenticator } from 'services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return { user: await authenticator.isAuthenticated(request) }
}

export default function Layout() {
  const { user } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <RouterProvider navigate={navigate}>
      <Header user={user} />
      <Separator />
      <Outlet />
    </RouterProvider>
  )
}

function Header({ user }: SerializeFrom<typeof loader>) {
  const logoutFetcher = useFetcher()
  const handleAction = useCallback(
    (key: Key) => {
      if (key !== 'logout') return
      logoutFetcher.submit({}, { action: '/auth/logout', method: 'POST' })
    },
    [logoutFetcher],
  )

  return (
    <header className="bg-mauve-2">
      <div className="container flex items-center justify-between py-3">
        <Link aria-label="home" to="/">
          <Logo className="h-10" />
        </Link>
        {!user && (
          <Form method="post" action="/auth/github/login">
            <Button
              type="submit"
              rounded="full"
              theme="default"
              iconLeft={<GitHubIcon />}
            >
              Continue with GitHub
            </Button>
          </Form>
        )}
        {user && (
          <Dropdown
            element={
              <Button rounded="full" theme="unstyled">
                <Avatar name={user.name} image={user.avatar} />
              </Button>
            }
          >
            <DropdownPopover placement="bottom right">
              <DropdownMenu onAction={handleAction}>
                <DropdownMenuItem id="logout" iconLeft={<LogoutIcon />}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        )}
      </div>
    </header>
  )
}
