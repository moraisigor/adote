import { useParams } from 'next/navigation'

import { useGetPost } from '@/http/post'

export default function PostPage() {
  const { id } = useParams()

  const { data: post } = useGetPost(String(id))

  return <div>Page</div>
}
