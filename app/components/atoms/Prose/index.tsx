import { type DetailedHTMLProps, type HTMLAttributes } from 'react'

import cx from 'utils/cx'

type ProseProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
export default function Prose({ className, ...props }: ProseProps) {
  return (
    <section
      className={cx(
        'prose prose-sm prose-gray dark:prose-invert tablet:prose-lg desktop:prose-xl large:prose-2xl',
      )}
      {...props}
    />
  )
}
