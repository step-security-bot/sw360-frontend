// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { ReleaseDetail } from '@/object-types'

import styles from '../detail.module.css'

interface Props {
    release: ReleaseDetail
}

const ECCDetails = ({ release }: Props) => {
    const t = useTranslations('default')
    const [toggle, setToggle] = useState(false)
    return (
        <div className='col'>
            <table className={`table label-value-table ${styles['summary-table']}`}>
                <thead
                    title='Click to expand or collapse'
                    onClick={() => {
                        setToggle(!toggle)
                    }}
                >
                    <tr>
                        <th colSpan={2}>{t('ECC Information')}</th>
                    </tr>
                </thead>
                <tbody hidden={toggle}>
                    <tr>
                        <td>{t('ECC Status')}:</td>
                        <td>
                            {
                                // @ts-expect-error: TS2345 invalidate translation even if is valid under
                                t(release.eccInformation.eccStatus)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>{t('AL')}:</td>
                        <td>{release.eccInformation.al}</td>
                    </tr>
                    <tr>
                        <td>ECCN:</td>
                        <td>{release.eccInformation.eccn}</td>
                    </tr>
                    <tr>
                        <td>{t('Material Index Number')}:</td>
                        <td>{release.eccInformation.materialIndexNumber}</td>
                    </tr>
                    <tr>
                        <td>{t('ECC Comment')}:</td>
                        <td>{release.eccInformation.eccComment}</td>
                    </tr>
                    <tr>
                        <td>{t('Assessor Contact Person')}:</td>
                        <td>{release.eccInformation.assessorContactPerson}</td>
                    </tr>
                    <tr>
                        <td>{t('Assessor Department')}:</td>
                        <td>{release.eccInformation.assessorDepartment}</td>
                    </tr>
                    <tr>
                        <td>{t('Assessment Date')}:</td>
                        <td>{release.eccInformation.assessmentDate}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ECCDetails
