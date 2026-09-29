import { useMutation, useQuery } from '@tanstack/react-query'

import { Pet } from '@/type/pet'

import { CreatePetRequest, SavePetRequest } from './request'

import { client } from '../http.client'

export const useListPet = () => {
  return useQuery({
    queryFn: () => client.get<Pet[]>('/pet').then((r) => r.data),
    queryKey: ['ListPet']
  })
}

export const useGetPet = (id: string) => {
  return useQuery({
    queryFn: () => client.get<Pet>(`/pet/${id}`).then((r) => r.data),
    queryKey: ['GetPet', id]
  })
}

export const useCreatePet = () => {
  return useMutation({
    mutationFn: (pet: CreatePetRequest) => client.post<Pet>('/pet', pet).then((r) => r.data),
    mutationKey: ['CreatePet']
  })
}

export const useSavePet = () => {
  return useMutation({
    // prettier-ignore
    mutationFn: ({ id, pet }: { id: string, pet: SavePetRequest}) => client.put<Pet>(`/pet/${id}`, pet).then((r) => r.data),
    mutationKey: ['SavePet']
  })
}

export const useRemovePet = () => {
  return useMutation({
    mutationFn: (id: string) => client.delete<Pet>(`/pet/${id}`).then((r) => r.data),
    mutationKey: ['RemovePet']
  })
}
