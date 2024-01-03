// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { useTranslations } from 'next-intl'
import { AiOutlineTags, AiOutlineUnorderedList } from 'react-icons/ai'
import { BsBag, BsFileEarmarkText, BsFilter, BsSearch } from 'react-icons/bs'
import { FiEdit2 } from 'react-icons/fi'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import { ImUsers } from 'react-icons/im'
import { RiArrowUpDownFill, RiOrganizationChart } from 'react-icons/ri'
import { RxCalendar } from 'react-icons/rx'

import { Link } from '@nextui-org/react'
import { Button } from '@sw360'

const AdminMainPage = () => {
    const t = useTranslations('default')

    return (
        <>
            <div className='mx-5 mt-3'>
                <div className='row d-flex justify-content-end buttonheader-title'>{t('ADMINISTRATION')}</div>
                <div className='flex flex-wrap gap-4 items-center'>
                    <Button variant='solid' size='lg' color='default' startContent={<ImUsers />} href='#' as={Link}>
                        {t('User')}
                    </Button>
                    <Button
                        variant='solid'
                        size='lg'
                        color='default'
                        startContent={<RiOrganizationChart />}
                        href='#'
                        as={Link}
                    >
                        {t('Department')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<BsBag />} href='#' as={Link}>
                        {t('Vendors')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<FiEdit2 />} href='#' as={Link}>
                        {t('Bulk Release Edit')}
                    </Button>
                    <Button
                        variant='solid'
                        size='lg'
                        color='default'
                        startContent={<BsFileEarmarkText />}
                        href='/admin/licenses'
                        as={Link}
                    >
                        {t('Licenses')}
                    </Button>
                    <Button
                        variant='solid'
                        size='lg'
                        color='default'
                        startContent={<AiOutlineTags />}
                        href='#'
                        as={Link}
                    >
                        {t('License Types')}
                    </Button>
                    <Button
                        variant='solid'
                        size='lg'
                        color='default'
                        startContent={<AiOutlineUnorderedList />}
                        href='#'
                        as={Link}
                    >
                        {t('Obligations')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<RxCalendar />} href='#' as={Link}>
                        {t('Schedule')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<RxCalendar />} href='#' as={Link}>
                        {t('Fossology')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<RxCalendar />} href='#' as={Link}>
                        {t('Fossology')}
                    </Button>
                    <Button
                        variant='solid'
                        size='lg'
                        color='default'
                        startContent={<RiArrowUpDownFill />}
                        href='#'
                        as={Link}
                    >
                        {t('Import Export')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<BsSearch />} href='#' as={Link}>
                        {t('Database Sanitation')}
                    </Button>
                    <Button variant='solid' size='lg' color='default' startContent={<BsFilter />} href='#' as={Link}>
                        {t('Attachment Cleanup')}
                    </Button>
                    <Button
                        variant='solid'
                        size='lg'
                        color='default'
                        startContent={<HiOutlineDocumentDuplicate />}
                        href='#'
                        as={Link}
                    >
                        {t('OAuth Client')}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdminMainPage
