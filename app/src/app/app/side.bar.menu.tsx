'use client'

import type { FunctionComponent } from 'react'

import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/react/16/solid'
import { HomeIcon, Square2StackIcon, TicketIcon } from '@heroicons/react/20/solid'
import {
  AvatarView,
  DropDown,
  DropDownButton,
  DropDownDivider,
  DropDownItem,
  DropDownLabel,
  DropDownMenu,
  SideBar,
  SideBarBody,
  SideBarFooter,
  SideBarHeader,
  SideBarItem,
  SideBarLabel,
  SideBarSection
} from '@hollowsoft/numb'

type SideBarMenuProps = {
  user?: {
    name?: string
    phone: string
  }
  current?: {
    id: string
    name: string
  }
  organization?: {
    id: string
    name: string
  }[]
  onOrganizationChange?: (organization: string) => void
}

export const SideBarMenu: FunctionComponent<SideBarMenuProps> = ({
  user,
  current,
  organization,
  onOrganizationChange,
  ...props
}: SideBarMenuProps) => {
  return (
    <SideBar {...props}>
      <SideBarHeader>
        {current && (
          <DropDown>
            <DropDownButton
              as={SideBarItem}
              key={current.id}
              class='lg:mb-2.5'>
              <AvatarView name={current.name} />
              <SideBarLabel>{current.name}</SideBarLabel>
              <ChevronDownIcon />
            </DropDownButton>
            <DropDownMenu
              class='min-w-80 lg:min-w-64'
              anchor='bottom start'>
              <DropDownItem href='/teams/1/settings'>
                <Cog8ToothIcon />
                <DropDownLabel>Settings</DropDownLabel>
              </DropDownItem>
              <DropDownDivider />
              {organization?.map((e) => {
                const { id, name } = e

                return (
                  <DropDownItem
                    key={id}
                    onClick={() => onOrganizationChange?.(id)}>
                    <AvatarView
                      slot='icon'
                      name={name}
                    />
                    <DropDownLabel>{name}</DropDownLabel>
                  </DropDownItem>
                )
              })}
              <DropDownDivider />
              <DropDownItem href='/app/space/create'>
                <PlusIcon />
                <DropDownLabel>New team&hellip;</DropDownLabel>
              </DropDownItem>
            </DropDownMenu>
          </DropDown>
        )}
      </SideBarHeader>
      <SideBarBody>
        <SideBarSection>
          <SideBarItem href='/app/home'>
            <HomeIcon />
            <SideBarLabel>Home</SideBarLabel>
          </SideBarItem>
          <SideBarItem href='/app/patient'>
            <Square2StackIcon />
            <SideBarLabel>Paciente</SideBarLabel>
          </SideBarItem>
          <SideBarItem href='/app/appointment'>
            <TicketIcon />
            <SideBarLabel>Consulta</SideBarLabel>
          </SideBarItem>
        </SideBarSection>
      </SideBarBody>
      <SideBarFooter class='max-lg:hidden'>
        {user && (
          <DropDown>
            <DropDownButton as={SideBarItem}>
              <span class='flex min-w-0 items-center gap-3'>
                <AvatarView
                  name={user.name}
                  class='size-10'
                />
                <span class='min-w-0'>
                  <span class='block truncate text-sm/5 font-medium text-zinc-950 dark:text-white'>
                    {user.name}
                  </span>
                  <span class='block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400'>
                    {user.phone}
                  </span>
                </span>
              </span>
              <ChevronUpIcon />
            </DropDownButton>
            <DropDownMenu
              class='min-w-64'
              anchor='top start'>
              <DropDownItem href='/account'>
                <UserIcon />
                <DropDownLabel>Conta</DropDownLabel>
              </DropDownItem>
              <DropDownDivider />
              <DropDownItem href='/logout'>
                <ArrowRightStartOnRectangleIcon />
                <DropDownLabel>Sair</DropDownLabel>
              </DropDownItem>
            </DropDownMenu>
          </DropDown>
        )}
      </SideBarFooter>
    </SideBar>
  )
}
