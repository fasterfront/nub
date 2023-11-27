import { forwardRef, useCallback, type ReactNode } from 'react'
import {
  Menu,
  MenuItem,
  type MenuItemProps,
  MenuTrigger,
  type MenuTriggerProps,
  type MenuProps,
  type MenuItemRenderProps,
} from 'react-aria-components'
import cx from 'utils/cx'

type DropdownMenuProps = MenuTriggerProps & {
  element: ReactNode
}
export default function Dropdown({
  element,
  children,
  ...props
}: DropdownMenuProps) {
  return (
    <MenuTrigger {...props}>
      {element}
      {children}
    </MenuTrigger>
  )
}

export function DropdownMenu<T extends object>({
  className,
  ...props
}: MenuProps<T>) {
  return (
    <Menu className={cx('min-w-[12rem] outline-none', className)} {...props} />
  )
}

type DropdownMenuItemProps = MenuItemProps & {
  iconLeft?: ReactNode
  iconRight?: ReactNode
}
export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  { className: _className, iconLeft, iconRight, children, ...props },
  ref,
) {
  const className = useCallback(
    (renderProps: MenuItemRenderProps) =>
      cx(
        'flex cursor-pointer items-center gap-x-2 px-3 py-1.5 text-sm font-medium outline-none transition hover:outline-none focus:outline-none',
        (renderProps.isHovered ||
          renderProps.isFocused ||
          renderProps.isSelected) &&
          'bg-mauve-4',
        typeof _className === 'function' ? _className(renderProps) : _className,
      ),
    [_className],
  )

  return (
    <MenuItem ref={ref} className={className} {...props}>
      {(renderProps) => (
        <>
          {iconLeft && (
            <span className="h-5 w-5 flex-shrink-0">{iconLeft}</span>
          )}
          <div>
            {typeof children === 'function' ? children(renderProps) : children}
          </div>
          {iconRight && (
            <span className="h-5 w-5 flex-shrink-0">{iconRight}</span>
          )}
        </>
      )}
    </MenuItem>
  )
})

export { default as DropdownPopover } from 'components/atoms/Popover'
