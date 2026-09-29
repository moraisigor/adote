import { useMutation, useQuery } from '@tanstack/react-query'

import { Organization } from '@/type/organization'

import { CreateOrganizationRequest, SaveOrganizationRequest } from './request'

import { client } from '../http.client'

export const useListOrganization = () => {
  return useQuery({
    queryFn: () => client.get<Organization[]>('/organization').then((r) => r.data),
    queryKey: ['ListOrganization']
  })
}

export const useGetOrganization = (id: string) => {
  return useQuery({
    queryFn: () => client.get<Organization>(`/organization/${id}`).then((r) => r.data),
    queryKey: ['GetOrganization', id]
  })
}

export const useCreateOrganization = () => {
  return useMutation({
    mutationFn: (organization: CreateOrganizationRequest) =>
      client.post<Organization>('/organization', organization).then((r) => r.data),
    mutationKey: ['CreateOrganization']
  })
}

export const useSaveOrganization = () => {
  return useMutation({
    // prettier-ignore
    mutationFn: ({ id, organization }: { id: string, organization: SaveOrganizationRequest }) =>
      client.put<Organization>(`/organization/${id}`, organization).then((r) => r.data),
    mutationKey: ['SaveOrganization']
  })
}

export const useRemoveOrganization = () => {
  return useMutation({
    mutationFn: (id: string) => client.delete<Organization>(`/organization/${id}`).then((r) => r.data),
    mutationKey: ['RemoveOrganization']
  })
}
