import type { ComponentProps, FunctionComponent, ReactNode } from 'react'

type PrivacyNoticeAlertProps = {
  label?: {
    accept: string
    reject: string
  }
  content: ReactNode
  onReject?: () => void
  onAccept?: () => void
} & ComponentProps<'div'>

export const PrivacyNoticeAlert: FunctionComponent<PrivacyNoticeAlertProps> = ({
  label = {
    accept: 'Aceitar',
    reject: 'Recusar'
  },
  content,
  onReject,
  onAccept,
  ...props
}: PrivacyNoticeAlertProps) => {
  const { accept, reject } = label

  return (
    <div
      {...props}
      class='pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6'>
      <div class='pointer-events-auto mx-auto max-w-xl rounded-xl bg-white p-6 shadow-lg outline-1 outline-gray-900/10 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10'>
        <p class='text-sm/6 text-gray-900 dark:text-white'>{content}</p>
        <div class='mt-4 flex items-center gap-x-5'>
          <button
            type='button'
            class='rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-gray-700 dark:inset-ring dark:inset-ring-white/10 dark:hover:bg-white/15 dark:focus-visible:outline-white'
            onClick={onAccept}>
            {accept}
          </button>
          <button
            type='button'
            class='text-sm/6 font-semibold text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300'
            onClick={onReject}>
            {reject}
          </button>
        </div>
      </div>
    </div>
  )
}
