import { useQuery } from '@tanstack/react-query'

import { Location } from '@/type/location'

import { client } from '../http.client'

export const search = (search: string) => {
  return client
    .get<Location[]>('/location', { params: { search } })
    .then((r) => r.data)
    .catch<Location[]>(() => [])
}

export const useSearchLocation = (search: string, enabled: boolean = false) => {
  return useQuery({
    queryFn: () => client.get<Location[]>('/location', { params: { search } }).then((r) => r.data),
    queryKey: ['SearchLocation', search],
    enabled
  })
}
