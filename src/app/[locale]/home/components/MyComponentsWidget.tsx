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
import { Component, Embedded } from '@/object-types'
import { ApiUtils, CommonUtils, UrlWithParams } from '@/utils'

import HomeTableHeader from './HomeTableHeader'

type EmbeddedComponent = Embedded<Component, 'sw360:components'>

function MyComponentsWidget() {
    const [data, setData] = useState([])
    const t = useTranslations('default')
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()

    const fetchData = useCallback(
        async (queryUrl: string, signal: AbortSignal) => {
            const response = await ApiUtils.GET(queryUrl, session?.user?.access_token, signal)
            if (response.status == HttpStatus.OK) {
                const data = await response.json()
                return data
            } else {
                return undefined
            }
        },
        [session],
    )

    useEffect(() => {
        setLoading(true)
        const queryUrl = UrlWithParams('components/mycomponents')

        const controller = new AbortController()
        const signal = controller.signal

        fetchData(queryUrl, signal)
            .then((components: EmbeddedComponent) => {
                if (!CommonUtils.isNullOrUndefined(components['_embedded']['sw360:components'])) {
                    setData(
                        components['_embedded']['sw360:components'].map((item: Component) => [
                            _(<Link href={'components/detail/' + item.id}>{item.name}</Link>),
                            CommonUtils.truncateText(item.description, 40),
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

    const title = t('My Components')
    const columns = [t('Component Name'), t('Description')]
    const language = { noRecordsFound: t('NotOwnComponent') }

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

export default MyComponentsWidget
