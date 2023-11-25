import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useSeparator } from 'react-aria'
import cx from 'utils/cx'

type SeparatorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  orientation: 'horizontal' | 'vertical'
}
export default function Separator(props: SeparatorProps) {
  const { separatorProps } = useSeparator(props)

  return (
    <div
      {...separatorProps}
      className={cx(
        'bg-neutral-100 opacity-10',
        props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
        props.className,
        separatorProps.className,
      )}
    />
  )
}
Separator.defaultProps = {
  orientation: 'horizontal',
}
