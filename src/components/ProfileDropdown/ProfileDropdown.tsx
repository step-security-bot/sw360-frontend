// Copyright (c) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import NavDropdown from 'react-bootstrap/NavDropdown'

import sw360ProfileIcon from '@/assets/images/profile.svg'

import navbarStyles from './ProfileDropdown.module.css'

const UserProfile = <Image className={navbarStyles.profileImage} src={sw360ProfileIcon} alt='Profile' />

function ProfileDropdown() {
    const t = useTranslations('default')
    return (
        <NavDropdown id='profileDropdown' title={UserProfile}>
            <NavDropdown.Divider />
            <NavDropdown.Item href='' onClick={() => signOut({ callbackUrl: '/' })}>
                {t('Logout')}
            </NavDropdown.Item>
        </NavDropdown>
    )
}

export default ProfileDropdown
