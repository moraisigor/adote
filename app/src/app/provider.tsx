'use client'

import { ReactNode } from 'react'

import { LinkProvider } from '@hollowsoft/estopinha'
import { QueryClientProvider } from '@tanstack/react-query'
import Link from 'next/link'

import { query } from '@/http/query.client'

export function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={query}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </QueryClientProvider>
  )
}
