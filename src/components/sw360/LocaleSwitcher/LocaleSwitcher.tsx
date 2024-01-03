// Copyright (C) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useLocale } from 'next-intl'
import React, { Key, useTransition } from 'react'

import { LOCALES } from '@/constants'
import { usePathname, useRouter } from '../../../navigation'

interface Option {
    i18n: string
    flag: string
}

function LocaleSwitcher({ className }: { className: string }) {
    const [, startTransition] = useTransition()
    const router = useRouter()
    const locale = useLocale()
    const pathname = usePathname()

    const [, setSelectedOption] = React.useState<Option | null>(null)

    function getCurrentFlag() {
        const current = LOCALES.find((cur) => cur.i18n === locale)
        return current ? current.flag : undefined
    }

    function getLanguageName(lang: string) {
        const langName = new Intl.DisplayNames([locale], { type: 'language' })
        return langName.of(lang)
    }
    const handleSelect = (selectedId: Key) => {
        const option = LOCALES.find((option) => option.i18n === selectedId)
        const nextLocale = option.i18n
        setSelectedOption(option || null)

        startTransition(() => {
            router.replace(pathname, { locale: nextLocale })
        })
        setSelectedOption(option)
    }

    return (
        <Dropdown className={className}>
            <DropdownTrigger>
                <span className={`fi fi-${getCurrentFlag()}`} />
            </DropdownTrigger>

            <DropdownMenu aria-label='Language Switcher' onAction={(key) => handleSelect(key)}>
                {LOCALES.map((option) => (
                    <DropdownItem key={option.i18n}>
                        <span className={`fi fi-${option.flag}`} />
                        <span style={{ marginLeft: '4px' }}>{getLanguageName(option.i18n)}</span>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default LocaleSwitcher
