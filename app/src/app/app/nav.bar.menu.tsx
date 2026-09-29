'use client'

import type { FunctionComponent } from 'react'

import { ArrowRightStartOnRectangleIcon, UserIcon } from '@heroicons/react/16/solid'
import {
  AvatarView,
  DropDown,
  DropDownButton,
  DropDownDivider,
  DropDownItem,
  DropDownLabel,
  DropDownMenu,
  NavBar,
  NavBarItem,
  NavBarSection,
  NavBarSpacer
} from '@hollowsoft/numb'

type NavBarMenuProps = {
  user?: {
    name?: string
  }
}

export const NavBarMenu: FunctionComponent<NavBarMenuProps> = ({ user, ...props }: NavBarMenuProps) => {
  return (
    <NavBar {...props}>
      <NavBarSpacer />
      <NavBarSection>
        {user && (
          <DropDown>
            <DropDownButton as={NavBarItem}>
              <AvatarView name={user.name} />
            </DropDownButton>
            <DropDownMenu
              class='min-w-64'
              anchor='bottom end'>
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
      </NavBarSection>
    </NavBar>
  )
}
