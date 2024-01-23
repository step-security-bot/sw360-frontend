// Copyright (c) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { _, Table } from 'next-sw360'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'

import { HttpStatus } from '@/object-types'
import { Embedded, Project } from '@/object-types'
import { ApiUtils, CommonUtils, UrlWithParams } from '@/utils'

import HomeTableHeader from './HomeTableHeader'

type EmbeddedProject = Embedded<Project, 'sw360:projects'>

function MyProjectsWidget() {
    const [data, setData] = useState([])
    const t = useTranslations('default')
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()

    const fetchData = useCallback(
        async (queryUrl: string, signal: AbortSignal) => {
            const response = await ApiUtils.GET(queryUrl, session?.user?.access_token, signal)
            if (response.status == HttpStatus.OK) {
                const myprojects = await response.json()
                return myprojects
            } else {
                return undefined
            }
        },
        [session],
    )

    useEffect(() => {
        setLoading(true)
        const queryUrl = UrlWithParams('projects/myprojects')

        const controller = new AbortController()
        const signal = controller.signal

        fetchData(queryUrl, signal)
            .then((projects: EmbeddedProject) => {
                if (!CommonUtils.isNullOrUndefined(projects['_embedded']['sw360:projects'])) {
                    setData(
                        projects['_embedded']['sw360:projects'].map((item: Project) => [
                            _(
                                <Link href={'projects/detail/' + CommonUtils.getIdFromUrl(item._links.self.href)}>
                                    {item.name} ({item.version})
                                </Link>,
                            ),
                            CommonUtils.truncateText(item.description, 40),
                            item.version,
                        ]),
                    )
                    setLoading(false)
                }
            })
            .catch(() => {
                console.error('False to fetch components')
            })

        return () => {
            controller.abort()
        }
    }, [fetchData, session])

    const title = t('My Projects')
    const columns = [t('Project Name'), t('Description'), t('Approved Releases')]
    const language = { noRecordsFound: t('NoProjectsFound') }

    return (
        <div>
            <HomeTableHeader title={title} />
            {loading == false ? (
                <Table columns={columns} data={data} pagination={{ limit: 5 }} selector={false} language={language} />
            ) : (
                <div className='col-12'>
                    <Spinner className='spinner' />
                </div>
            )}
        </div>
    )
}

export default MyProjectsWidget
