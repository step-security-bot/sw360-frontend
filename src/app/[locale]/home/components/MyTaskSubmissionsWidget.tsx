// Copyright (c) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { useTranslations } from 'next-intl'
import { Table } from 'next-sw360'
import React, { useEffect, useState } from 'react'

import HomeTableHeader from './HomeTableHeader'

function MyTaskSubmissionsWidget() {
    const [data] = useState([])
    const t = useTranslations('default')

    useEffect(() => {
        //     const fetchData = async () => {
        //         const data = await sw360FetchData('/myTaskSubmissions')
        //         setData(
        //             data.map((item: { name: string; status: string; actions: string }) => [
        //                 item.name,
        //                 item.status,
        //                 item.actions,
        //             ])
        //         )
        //     }
        //     fetchData()
    })

    const title = t('My Task Submissions')
    const columns = [t('Document Name'), t('Status'), t('Actions')]
    const language = { noRecordsFound: t('NoModerationRequests') }

    return (
        <div>
            <HomeTableHeader title={title} />
            <Table columns={columns} data={data} language={language} />
        </div>
    )
}

export default MyTaskSubmissionsWidget
