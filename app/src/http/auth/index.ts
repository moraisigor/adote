import { useMutation } from '@tanstack/react-query'

import { Token } from '@/type/token'
import { User } from '@/type/user'

import type { VerifyRequest } from './request'

import { client } from '../http.client'

export const useAuthentication = () => {
  return useMutation({
    mutationFn: (phone: string) => client.post<User>('/auth', { phone }).then((r) => r.data),
    mutationKey: ['Authentication']
  })
}

export const useVerification = () => {
  return useMutation({
    mutationFn: (request: VerifyRequest) => client.post<Token>('/auth/verify', request).then((r) => r.data),
    mutationKey: ['Verification']
  })
}
