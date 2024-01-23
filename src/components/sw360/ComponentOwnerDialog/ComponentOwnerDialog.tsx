// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { notFound } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

import { ComponentOwner, ComponentOwnerType, HttpStatus } from '@/object-types'
import { ApiUtils, CommonUtils } from '@/utils'

import SelectTableComponentOwner from '../SelectTableComponentOwner/SelectTableComponentOwner'

interface Props {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    selectComponentOwner: ComponentOwnerType
}

function ComponentOwnerDialog({ show, setShow, selectComponentOwner }: Props) {
    const t = useTranslations('default')
    const { data: session } = useSession()
    const [data, setData] = useState()
    const [componentOwner, setComponentOwner] = useState<ComponentOwner>()
    const [users, setUsers] = useState([])

    const handleCloseDialog = () => {
        setShow(!show)
    }

    const searchVendor = () => {
        setUsers(data)
    }

    const fetchData: any = useCallback(
        async (url: string) => {
            const response = await ApiUtils.GET(url, session.user.access_token)
            if (response.status == HttpStatus.OK) {
                const data = await response.json()
                return data
            } else {
                notFound()
            }
        },
        [session],
    )

    useEffect(() => {
        fetchData(`users`).then((users: any) => {
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
        })
    }, [fetchData])

    const handleClickSelectComponentOwnerId = () => {
        selectComponentOwner(componentOwner)
        setShow(!show)
    }

    const getComponentOwner: ComponentOwnerType = useCallback(
        (componentOwner: ComponentOwner) => setComponentOwner(componentOwner),
        [],
    )

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
                            <button type='button' className='btn btn-secondary me-2' onClick={searchVendor}>
                                {t('Search')}
                            </button>
                            <button type='button' className='btn btn-secondary me-2'>
                                {t('Reset')}
                            </button>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <SelectTableComponentOwner users={users} setComponentOwner={getComponentOwner} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='justify-content-end'>
                <Button type='button' data-bs-dismiss='modal' className='btn btn-secondary' onClick={handleCloseDialog}>
                    {t('Close')}
                </Button>
                <Button type='button' className='btn btn-secondary'>
                    {t('Add User')}
                </Button>
                <Button type='button' className='btn btn-primary' onClick={handleClickSelectComponentOwnerId}>
                    {t('Select User')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ComponentOwnerDialog
