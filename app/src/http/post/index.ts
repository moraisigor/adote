import { useMutation, useQuery } from '@tanstack/react-query'

import { Post } from '@/type/post'

import { CreatePostRequest, ListPostRequest, SavePostRequest } from './request'

import { client } from '../http.client'

export const useListPost = (request: ListPostRequest) => {
  return useQuery({
    queryFn: () => client.get<Post[]>('/post', { params: request }).then((r) => r.data),
    queryKey: ['ListPost', request]
  })
}

export const useGetPost = (id: string) => {
  return useQuery({
    queryFn: () => client.get<Post>(`/post/${id}`).then((r) => r.data),
    queryKey: ['GetPost', id]
  })
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: CreatePostRequest) => client.post<Post>('/post', post).then((r) => r.data),
    mutationKey: ['CreatePost']
  })
}

export const useSavePost = () => {
  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: SavePostRequest }) =>
      client.put<Post>(`/post/${id}`, post).then((r) => r.data),
    mutationKey: ['SavePost']
  })
}

export const useRemovePost = () => {
  return useMutation({
    mutationFn: (id: string) => client.delete<Post>(`/post/${id}`).then((r) => r.data),
    mutationKey: ['RemovePost']
  })
}
