import {
  type ReactNode,
  forwardRef,
  useCallback,
  type ForwardedRef,
} from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type ButtonRenderProps,
  Link as AriaLink,
} from 'react-aria-components'
import cx from 'utils/cx'
import { type LinkProps } from '../Link'
import styles from './index.module.css'

export type ButtonProps = AriaButtonProps & {
  theme?: 'default' | 'primary' | 'danger' | 'unstyled'
  rounded?: 'default' | 'full'
  iconLeft?: ReactNode
  iconRight?: ReactNode
  to?: LinkProps['to']
  relative?: LinkProps['relative']
}
export default forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className: _className,
      style: _style,
      children: _children,
      theme = 'default',
      rounded = 'default',
      iconLeft,
      iconRight,
      to,
      relative,
      ...props
    },
    ref,
  ) {
    const className = useCallback(
      (renderProps: ButtonRenderProps) =>
        cx(
          styles.button,
          theme === 'default' && 'dark',
          styles[`theme-${theme}`],
          styles[`rounded-${rounded}`],
          'transition',
          renderProps.isFocused && styles.focused,
          renderProps.isHovered && styles.hovered,
          renderProps.isPressed && styles.pressed,
          typeof _className === 'function'
            ? _className(renderProps)
            : _className,
        ),
      [theme, rounded, _className],
    )

    const children = (renderProps: ButtonRenderProps) => (
      <div className={cx(styles.inner, 'transition before:transition')}>
        {iconLeft && <span className="h-5 w-5 flex-shrink-0">{iconLeft}</span>}
        <div>
          {typeof _children === 'function' ? _children(renderProps) : _children}
        </div>
        {iconRight && (
          <span className="h-5 w-5 flex-shrink-0">{iconRight}</span>
        )}
      </div>
    )

    if (typeof to !== 'undefined') {
      return (
        <AriaLink
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          className={className}
          href={to}
          {...props}
        >
          {children}
        </AriaLink>
      )
    }

    return (
      <AriaButton
        ref={ref as ForwardedRef<HTMLButtonElement>}
        className={className}
        {...props}
      >
        {children}
      </AriaButton>
    )
  },
)
