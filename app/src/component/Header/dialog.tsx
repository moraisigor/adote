import type { FunctionComponent, ReactNode } from 'react'

import { Dialog as DialogComponent, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type DialogProps = {
  open: boolean
  option: {
    url: string
    name: string
    children: ReactNode
  }
  navigation?: {
    key: string
    name: string
  }[]
  setOpen: (open: boolean) => void
  onNavigation?: (key: string) => void
}

export const Dialog: FunctionComponent<DialogProps> = ({
  open,
  option: { url, name, children },
  navigation,
  setOpen,
  onNavigation
}: DialogProps) => {
  return (
    <DialogComponent
      open={open}
      onClose={setOpen}>
      <div class='fixed inset-0 z-50' />
      <DialogPanel class='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10'>
        <div class='flex items-center justify-between'>
          <a
            class='-m-1.5 p-1.5'
            href={url}>
            <span class='sr-only'>{name}</span>
            {children}
          </a>
          <button
            class='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400'
            type='button'
            onClick={() => setOpen(false)}>
            <span class='sr-only'>close menu</span>
            <XMarkIcon
              class='size-6'
              aria-hidden='true'
            />
          </button>
        </div>
        <div class='mt-6 flow-root'>
          <div class='-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/20'>
            <div class='space-y-2 py-6'>
              {navigation?.map((e) => {
                const { key, name } = e

                return (
                  <span
                    class='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5'
                    key={key}
                    onClick={() => onNavigation?.(key)}>
                    {name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </DialogPanel>
    </DialogComponent>
  )
}
