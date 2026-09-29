'use client'

import { useCallback, type ReactNode } from 'react'

import { SideBarLayout } from '@hollowsoft/numb'
import { useRouter } from 'next/navigation'

import { useListOrganization } from '@/http/organization'
import { useGetCurrentUser, useSetCurrentOrganization } from '@/http/user'

import { useOrganizationStore } from '@/store/organization.store'

import { NavBarMenu } from './nav.bar.menu'
import { SideBarMenu } from './side.bar.menu'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()

  const { data: user } = useGetCurrentUser()

  const { data: list } = useListOrganization()

  const { mutate: set } = useSetCurrentOrganization()

  const { setCurrent } = useOrganizationStore()

  const onOrganizationChange = useCallback(
    (organization: string) => {
      set(organization, {
        onError: (e) => console.error(e),
        onSuccess: () => setCurrent(organization)
      })
    },
    [set, setCurrent]
  )

  return (
    <SideBarLayout
      nav={<NavBarMenu user={user} />}
      side={
        <SideBarMenu
          user={user}
          current={user?.organization}
          organization={list}
          onOrganizationChange={onOrganizationChange}
        />
      }>
      {children}
    </SideBarLayout>
  )
}
