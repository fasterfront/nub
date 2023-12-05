import { type DataFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import useUser from 'hooks/useUser'
import Link from 'components/atoms/Link'
import Prose from 'components/atoms/Prose'

import getPublicNubs from './getPublicNubs.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'nub – A collaborative-first alternative to Gist' },
    {
      name: 'description',
      content: 'A collaborative-first alternative to Gist',
    },
  ]
}

export function loader({ request }: DataFunctionArgs) {
  const url = new URL(request.url)
  const maybePage = Number(url.searchParams.get('page'))
  const page = Number.isNaN(maybePage) || maybePage < 1 ? 1 : maybePage

  const nubs = getPublicNubs({ limit: 10, offset: (page - 1) * 10 })
  return { nubs }
}

export default function Index() {
  const user = useUser()
  const { nubs } = useLoaderData<typeof loader>()

  return (
    <main className="container flex flex-col items-center justify-center pt-8 tablet:pt-12 desktop:pt-24 large:pt-40">
      <Prose>
        <h2>
          Welcome
          {user && <>, {user.name}</>}!
        </h2>
        <p>
          <b>nub</b> is a <i>work-in-progress</i> collaborative-first
          alternative to Gist.
        </p>
        <p>
          The project is open source and you can follow its{' '}
          <Link to="https://github.com/fasterfront/nub">
            development on GitHub
          </Link>
          .
        </p>
        <p>
          {!user && (
            <>
              You can already create an account by clicking "Continue with
              GitHub" above.
              <br />
            </>
          )}
          We'll let you know when nub is available!
        </p>
      </Prose>
      <pre className="mt-20 flex max-w-full flex-col gap-y-4">
        {nubs.map((nub) => (
          <code
            key={nub.id}
            className="max-w-full overflow-x-auto rounded border border-gray-5 bg-gray-3 p-2"
          >
            {JSON.stringify(nub, null, 2)}
          </code>
        ))}
      </pre>
    </main>
  )
}
