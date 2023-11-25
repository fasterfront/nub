import { forwardRef } from 'react'
import {
  type LinkProps as RemixLinkProps,
  type NavLinkProps as RemixNavLinkProps,
} from '@remix-run/react'
import { Link as RemixLink, NavLink as RemixNavLink } from '@remix-run/react'

import cx from 'utils/cx'

export type LinkProps = Omit<RemixLinkProps, 'to'> & { to: string }
export default forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, to, prefetch = 'intent', children, ...props },
  ref,
) {
  const external = to.startsWith('http')

  return (
    <RemixLink
      ref={ref}
      className={className}
      to={to}
      prefetch={prefetch}
      {...(external && { rel: 'noreferrer', target: '_blank' })}
      unstable_viewTransition
      {...props}
    >
      {children}
    </RemixLink>
  )
})

export type NavLinkProps = RemixNavLinkProps
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink(
    { className, to, prefetch = 'intent', children, ...props },
    ref,
  ) {
    const getClassName = (renderProps: NavLinkRenderProps) =>
      cx(
        renderProps.isActive && 'font-semibold',
        typeof className === 'function' ? className(renderProps) : className,
      )

    return (
      <RemixNavLink
        ref={ref}
        className={getClassName}
        to={to}
        prefetch={prefetch}
        unstable_viewTransition
        {...props}
      >
        {children}
      </RemixNavLink>
    )
  },
)

export type NavLinkRenderProps = Parameters<
  Exclude<RemixNavLinkProps['className'], string | undefined>
>[0]
