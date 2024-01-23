// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { notFound, useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

import { HttpStatus, Moderators, ModeratorsType } from '@/object-types'
import { ApiUtils, CommonUtils } from '@/utils'

import SelectTableModerators from './SelectTableContributors'

interface Props {
    show?: boolean
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
    selectModerators?: ModeratorsType
}

const ContributorsDialog = ({ show, setShow, selectModerators }: Props) => {
    const t = useTranslations('default')
    const { data: session } = useSession()
    const [data, setData] = useState()
    const params = useSearchParams()
    const [moderators] = useState([])
    const [moderatorsResponse, setModeratorsResponse] = useState<Moderators>()
    const [users, setUsers] = useState([])

    const handleCloseDialog = () => {
        setShow(!show)
    }

    const searchVendor = () => {
        setUsers(data)
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        ;(async () => {
            try {
                const queryUrl = CommonUtils.createUrlWithParams(`users`, Object.fromEntries(params))
                const response = await ApiUtils.GET(queryUrl, session.user.access_token, signal)
                if (response.status === HttpStatus.UNAUTHORIZED) {
                    return signOut()
                } else if (response.status !== HttpStatus.OK) {
                    return notFound()
                }
                const users = await response.json()
                if (
                    !CommonUtils.isNullOrUndefined(users['_embedded']) &&
                    !CommonUtils.isNullOrUndefined(users['_embedded']['sw360:users'])
                ) {
                    const data = users['_embedded']['sw360:users'].map((item: any) => [
                        item,
                        item.givenName,
                        item.lastName,
                        item.email,
                        item.department,
                    ])
                    setData(data)
                }
            } catch (e) {
                console.error(e)
            }
        })()
        return () => controller.abort()
    }, [params, session])

    const handleClickSelectModerators = () => {
        selectModerators(moderatorsResponse)
        setShow(!show)
    }

    const getModerators: ModeratorsType = useCallback((moderators: Moderators) => setModeratorsResponse(moderators), [])

    return (
        <Modal show={show} onHide={handleCloseDialog} backdrop='static' centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{t('Search User')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modal-body'>
                    <div className='row'>
                        <div className='col-lg-8'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={t('Enter search text')}
                                aria-describedby='Search User'
                            />
                        </div>
                        <div className='col-lg-4'>
                            <button
                                type='button'
                                className={`fw-bold btn btn-light button-plain me-2`}
                                onClick={searchVendor}
                            >
                                {t('Search')}
                            </button>
                            <button type='button' className={`fw-bold btn btn-light button-plain me-2`}>
                                {t('Reset')}
                            </button>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <SelectTableModerators users={users} setModerator={getModerators} emails={moderators} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='justify-content-end'>
                <Button
                    type='button'
                    data-bs-dismiss='modal'
                    className={`fw-bold btn btn-light button-plain me-2`}
                    onClick={handleCloseDialog}
                >
                    {t('Close')}
                </Button>
                <Button type='button' className={`btn btn-primary`} onClick={handleClickSelectModerators}>
                    {t('Select User')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ContributorsDialog
