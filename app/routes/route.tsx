import { type MetaFunction } from '@remix-run/node'

import useUser from 'hooks/useUser'
import Link from 'components/atoms/Link'
import Prose from 'components/atoms/Prose'

export const meta: MetaFunction = () => {
  return [
    { title: 'nub – A collaborative-first alternative to Gist' },
    {
      name: 'description',
      content: 'A collaborative-first alternative to Gist',
    },
  ]
}

export default function Index() {
  const user = useUser()

  return (
    <main className="container flex justify-center pt-8 tablet:pt-12 desktop:pt-24 large:pt-40">
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
    </main>
  )
}
