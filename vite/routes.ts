import {
  type DefineRoutesFunction,
  type DefineRouteFunction,
} from '@remix-run/dev/dist/config/routes'
import dirTree from 'directory-tree'

type RouteMap = Map<string, RouteMap | undefined>

export default async function routes(defineRoutes: DefineRoutesFunction) {
  return defineRoutes((route: DefineRouteFunction) => {
    const tree = dirTree('./app/routes')
    const routeMap = recurseTree(tree, new Map())
    createRoutes(route, routeMap)
  })
}

function recurseTree(
  subtree: dirTree.DirectoryTree,
  route: RouteMap,
  parentRoute?: RouteMap,
) {
  const lastMap = Array.from(route).findLast(([, map]) => Boolean(map))
  if (lastMap) {
    const parentPath = lastMap[0].split('/').slice(0, -1).join('/')
    parentRoute = route
    route = (subtree.path.startsWith(parentPath) && lastMap[1]) || route
  }

  if (subtree.children) {
    subtree.children
      .toSorted((a) => (a.path.endsWith('layout.tsx') ? -1 : 1))
      .forEach((child) => recurseTree(child, route, parentRoute))
  } else {
    if (subtree.name === 'layout.tsx') {
      route.set(subtree.path, new Map())
    } else if (subtree.name === 'route.tsx') {
      const shouldSkipLayout = subtree.path
        .split('/')
        .slice(0, -1)
        .some((f) => f.endsWith('_'))

      const routeToSet = shouldSkipLayout && parentRoute ? parentRoute : route
      routeToSet.set(subtree.path, undefined)
    }
  }
  return route
}

function createRoutes(
  route: DefineRouteFunction,
  routeMap: RouteMap,
  depth = 0,
) {
  for (const [path, children] of routeMap) {
    const filePath = path.substring('app/'.length)
    let routePath = filePath
      .slice('routes/'.length)
      .split('/')
      .filter((f) => !f.startsWith('_'))
      .map((f) => (f.endsWith('_') ? f.slice(0, -1) : f))
      .slice(depth, -1)
      .join('/')

    if (routePath === '$') {
      routePath = '*'
    } else if (routePath.startsWith('$')) {
      routePath = `:${routePath.slice(1)}`
    }

    route(
      routePath,
      filePath,
      children
        ? () => createRoutes(route, children, depth + 1)
        : { index: true },
    )
  }
}
