// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import React from 'react'
import { useTranslations } from 'next-intl'
import { COMMON_NAMESPACE } from '@/object-types/Constants'
import styles from './TitleLinkedReleases.module.css'
export default function TitleLinkedReleases() {
    const t = useTranslations(COMMON_NAMESPACE)
    return (
        <>
            <div className={`row ${styles['div-title-second']}`}>
                <div className={`${styles['div-filename']}`}>
                    <p className='fw-bold mt-2' >{t('Vendor Name')}</p>
                </div>
                <div className={`${styles['div-filename']}`}>
                    <p className='fw-bold mt-2'>{t('Release name')}</p>
                </div>
                <div className={`${styles['div-filename']}`}>
                    <p className='fw-bold mt-2'>{t('Release version')}</p>
                </div>
                <div className={`${styles['div-filename']}`}>
                    <p className='fw-bold mt-2'>{t('Release relation')}</p>
                </div>
            </div>
        </>
    )
}