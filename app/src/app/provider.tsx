'use client'

import { ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import { query } from '@/http/query.client'

export function Provider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={query}>{children}</QueryClientProvider>
}
