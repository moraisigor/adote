import type { ComponentProps, FunctionComponent, ReactNode } from 'react'

type PrivacyNoticeProps = {
  label?: {
    accept: string
    reject: string
  }
  content: ReactNode
  onReject?: () => void
  onAccept?: () => void
} & ComponentProps<'div'>

export const PrivacyNotice: FunctionComponent<PrivacyNoticeProps> = ({
  label = {
    accept: 'Aceitar',
    reject: 'Recusar'
  },
  content,
  onReject,
  onAccept,
  ...props
}: PrivacyNoticeProps) => {
  const { accept, reject } = label

  return (
    <div
      {...props}
      class='fixed inset-x-0 bottom-0 flex flex-col justify-between gap-x-8 gap-y-4 border-t border-gray-900/10 bg-white p-6 shadow-lg md:flex-row md:items-center lg:px-8 dark:border-white/10 dark:bg-gray-800 dark:shadow-none'>
      <p class='max-w-4xl text-sm/6 text-gray-900 dark:text-white'>{content}</p>
      <div class='flex flex-none items-center gap-x-5'>
        <button
          type='button'
          class='rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-gray-700 dark:inset-ring dark:inset-ring-white/10 dark:hover:bg-white/15 dark:focus-visible:outline-white'
          onClick={onAccept}>
          {accept}
        </button>
        <button
          type='button'
          class='text-sm/6 font-semibold text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
          onClick={onReject}>
          {reject}
        </button>
      </div>
    </div>
  )
}
