import { useMutation, useQuery } from '@tanstack/react-query'

import { User } from '@/type/user'

import { client } from '../http.client'
import { query } from '../query.client'

export const useGetCurrentUser = () => {
  return useQuery({
    queryFn: () => client.get<User>('/user/current').then((r) => r.data),
    queryKey: ['GetCurrentUser']
  })
}

export const useSetCurrentOrganization = () => {
  return useMutation({
    mutationFn: (organization: string) =>
      client.put<unknown>('user/organization', { organization }).then((r) => r.data),
    mutationKey: ['SetCurrentOrganization'],
    onSuccess: () => query.invalidateQueries({ queryKey: ['GetCurrentUser'] })
  })
}
