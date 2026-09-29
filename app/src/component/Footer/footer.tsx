import type { ComponentProps, ComponentType, FunctionComponent, SVGProps } from 'react'

type FooterProps = {
  main: {
    url: string
    name: string
  }[]
  social: {
    url: string
    name: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
  }[]
  message: string
} & ComponentProps<'div'>

export const Footer: FunctionComponent<FooterProps> = ({ main, social, message, ...props }: FooterProps) => {
  return (
    <footer
      {...props}
      class='bg-white dark:bg-green-500'>
      <div class='mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8'>
        <nav
          class='-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6'
          aria-label='footer'>
          {main.map((e) => {
            const { url, name } = e

            return (
              <a
                class='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                key={name}
                href={url}>
                {name}
              </a>
            )
          })}
        </nav>
        <div class='mt-16 flex justify-center gap-x-10'>
          {social.map((e) => {
            const { url, name, icon: Icon } = e

            return (
              <a
                class='text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                key={name}
                href={url}>
                <span class='sr-only'>{name}</span>
                <Icon
                  class='size-6'
                  aria-hidden='true'
                />
              </a>
            )
          })}
        </div>
        <p class='mt-10 text-center text-sm/6 text-gray-600 dark:text-gray-400'>{message}</p>
      </div>
    </footer>
  )
}
