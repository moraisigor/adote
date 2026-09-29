import type { ComponentProps, FunctionComponent } from 'react'

import { clsx } from 'clsx'

import { Icon } from './icon'

type AvatarIconProps = {
  size?: 10 | 12 | 14 | 16
} & ComponentProps<'span'>

export const AvatarIcon: FunctionComponent<AvatarIconProps> = ({
  size = 10,
  class: style,
  ...props
}: AvatarIconProps) => {
  const styles = clsx([
    style,
    `inline-block size-${size} overflow-hidden rounded-full bg-gray-100 outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10`
  ])

  return (
    <span
      {...props}
      class={styles}>
      <Icon />
    </span>
  )
}
