'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import { SelectAsync, type Option } from '@/component/Select'

import { search } from '@/http/location'
import { useListPost } from '@/http/post'

export default function Page() {
  const router = useRouter()

  const [location, setLocation] = useState<string[]>([])

  const { data: post = [] } = useListPost({
    page: 1,
    amount: 10,
    location
  })

  const is = useCallback((search: string) => search.length >= 4, [])

  const options = useCallback(
    (value: string) =>
      // prettier-ignore
      new Promise<{ value: string, label: string }[]>((resolve) => {
        if (is(value)) {
          return search(value).then((list) => {
            const options = list.map((e) => ({
              value: e.id,
              label: `${e.city}, ${e.state}`
            }))

            return resolve(options)
          })
        }
        return resolve([])
      }),
    [is]
  )

  const onChange = useCallback((values: Option[]) => setLocation(values.map((e) => e.value)), [])

  return (
    <div>
      <SelectAsync
        multi
        options={options}
        onChange={onChange}
      />
      <ul></ul>
    </div>
  )
}
