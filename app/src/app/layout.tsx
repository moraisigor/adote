'use client'

import './style.css'

import { ReactNode, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { Footer, Header } from '@/component'

import { useTokenStore } from '@/store/token.store'

import { Font } from './font'
import { Provider } from './provider'

const main = []

const social = []

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()

  const { token } = useTokenStore()

  const option = useMemo(() => {
    if (token) {
      return {
        sign: 'Sair',
        onSign: () => {}
      }
    }

    return {
      sign: 'Entrar',
      onSign: () => router.push('/sign')
    }
  }, [token, router])

  const navigation = useMemo(() => {
    if (token) {
      return []
    }

    return []
  }, [token])

  return (
    <html
      lang='en'
      class={`h-full bg-white dark:bg-gray-950 scheme-light dark:scheme-dark ${Font.className}`}>
      <body class='h-full flex flex-col'>
        <Provider>
          <Header
            option={{
              url: '/',
              name: 'Adote',
              children: '',
              sign: option
            }}
            navigation={navigation}
          />
          <main class='flex-1'>{children}</main>
          <Footer
            main={[]}
            social={[]}
            message={''}
          />
        </Provider>
      </body>
    </html>
  )
}
