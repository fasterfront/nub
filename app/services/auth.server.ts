import { createCookie } from '@remix-run/node'
import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { Authenticator } from 'remix-auth'
import {
  type GitHubProfile,
  GitHubStrategy,
  type GitHubStrategyOptions,
} from 'remix-auth-github'

import { db } from 'db'
import { user } from 'db/schema'

import { sessionStorage } from './session.server'

const githubCredentials = {
  clientID: process.env.GITHUB_OAUTH_CLIENT_ID!,
  clientSecret: process.env.GITHUB_OAUTH_SECRET!,
  callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL!,
  scope: ['user:email'],
} satisfies GitHubStrategyOptions

/** Temporary cookie to store the path to redirect to after login */
export const redirectCookie = createCookie('redirect-to', { maxAge: 300 })

/** Temporary cookie to store which authentication type is being used */
export const oAuthTypeCookie = createCookie('oauth-type', { maxAge: 300 })

const gitHubLoginStrategy = new GitHubStrategy(
  githubCredentials,
  strategyVerifyCallback,
)

const githubImportOrgsStrategy = new GitHubStrategy(
  { ...githubCredentials, scope: ['user:email', 'read:org'] },
  strategyVerifyCallback,
)

const githubImportGistsStrategy = new GitHubStrategy(
  { ...githubCredentials, scope: ['user:email', 'gist'] },
  strategyVerifyCallback,
)

export const authenticator = new Authenticator<AuthUser>(sessionStorage)
authenticator.use(gitHubLoginStrategy, 'github')
authenticator.use(githubImportOrgsStrategy, 'github-import-orgs')
authenticator.use(githubImportGistsStrategy, 'github-import-gists')

// --
type StrategyVerifyCallBackParams = {
  profile: GitHubProfile
  accessToken: string
}
async function strategyVerifyCallback({
  profile,
  accessToken,
}: StrategyVerifyCallBackParams) {
  try {
    return upsertUserStatement.get({
      // TODO: we have $default set for id, but since we prepare the statement,
      // Drizzle runs the default function only once and reuses the value.
      // https://github.com/drizzle-team/drizzle-orm/issues/1588
      id: createId(),
      handle: profile._json.login,
      name: profile._json.name,
      email: profile.emails[0].value,
      avatar: profile._json.avatar_url,
      accessToken,
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}

export type AuthUser = ReturnType<(typeof upsertUserStatement)['get']>
const upsertUserStatement = db
  .insert(user)
  .values({
    id: sql.placeholder('id'),
    handle: sql.placeholder('handle'),
    name: sql.placeholder('name'),
    email: sql.placeholder('email'),
    avatar: sql.placeholder('avatar'),
    accessToken: sql.placeholder('accessToken'),
  })
  .onConflictDoUpdate({
    target: user.handle,
    set: {
      name: sql`excluded.name`,
      email: sql`excluded.email`,
      avatar: sql`excluded.avatar`,
      accessToken: sql`excluded.access_token`,
      updatedAt: new Date().toISOString(),
    },
  })
  .returning({
    id: user.id,
    handle: user.handle,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
  .prepare()
