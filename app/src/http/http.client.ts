import HttpClient, { InternalAxiosRequestConfig, AxiosResponse as Response } from 'axios'

import { useTokenStore as Store } from '@/store/token.store'

export type { Response }

export const client = HttpClient.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

client.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const { token } = Store.getState()

  if (token) {
    const {
      token: { hash }
    } = token

    request.headers['Authorization'] = `Bearer ${hash}`
  }

  return request
})
