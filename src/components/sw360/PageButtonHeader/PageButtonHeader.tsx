// Copyright (c) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { PageButtonHeaderProps } from './PageButtonHeader.types'
import styles from './pagebuttonheader.module.css'

import { Link } from '@nextui-org/react'
import { Button } from '@sw360'

function PageButtonHeader({ title, buttons, children }: PageButtonHeaderProps) {
    let buttonList: JSX.Element[] = []
    if (buttons) {
        buttonList = Object.entries(buttons).map(([key, value]) => {
            return (
                <Button key={key} onClick={value.onClick} as={Link} href={value['link']} color={value['color']}>
                    {value?.name}
                </Button>
            )
        })
    }

    return (
        <div className={`row ${styles['buttonheader-toolbar']}`}>
            <div className='col-auto'>
                <div className='btn-toolbar' role='toolbar'>
                    <div key='buttongroup' className='btn-group' role='group'>
                        {buttonList}
                        {children}
                    </div>
                </div>
            </div>
            {title && <div className={`col text-truncate ${styles['buttonheader-title']}`}>{title}</div>}
        </div>
    )
}

export default PageButtonHeader
