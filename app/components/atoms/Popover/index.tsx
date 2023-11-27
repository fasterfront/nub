import { forwardRef, useCallback } from 'react'
import {
  Popover as AriaPopover,
  type PopoverRenderProps,
  type PopoverProps,
} from 'react-aria-components'
import cx from 'utils/cx'

export default forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { className: _className, ...props },
  ref,
) {
  const className = useCallback(
    (renderProps: PopoverRenderProps) =>
      cx(
        'rounded-md border border-mauve-6 bg-mauve-3 py-2 shadow-sm transition',
        typeof _className === 'function' ? _className(renderProps) : _className,
      ),
    [_className],
  )

  return <AriaPopover ref={ref} className={className} {...props} />
})
