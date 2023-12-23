import { unstable_vitePlugin as remix } from '@remix-run/dev'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import routes from './vite/routes'

export default defineConfig({
  build: { target: browserslistToEsbuild() },
  plugins: [
    remix({
      routes,
      future: { v3_fetcherPersist: true, v3_relativeSplatPath: true },
    }),
    tsconfigPaths(),
  ],
})
