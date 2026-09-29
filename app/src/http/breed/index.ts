import { useQuery } from '@tanstack/react-query'

import { Breed } from '@/type/breed'
import { Kind } from '@/type/kind'

import { client } from '../http.client'

export const useListBreed = (kind: Kind) => {
  return useQuery({
    queryFn: () => client.get<Breed[]>('/breed', { params: { kind } }).then((r) => r.data),
    queryKey: ['ListBreed', kind]
  })
}
