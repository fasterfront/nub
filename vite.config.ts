import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import routes from './vite/routes'

export default defineConfig({
  plugins: [remix({ routes }), tsconfigPaths()],
})
