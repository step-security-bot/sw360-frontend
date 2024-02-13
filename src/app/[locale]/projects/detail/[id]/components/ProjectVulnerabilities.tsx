// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { HttpStatus, ProjectData, ProjectsPayloadElement } from '@/object-types'
import { ApiUtils } from '@/utils'
import { signOut, useSession } from 'next-auth/react'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import VulnerabilityTab from './VulnerabilityTab'

const extractLinkedProjects = (projectPayload: ProjectsPayloadElement[], projectData: ProjectData[]) => {
    if(!projectPayload) {
        return
    }
    for (const x of projectPayload) {
        projectData.push({
            id: x['_links']['self']['href'].substring(x['_links']['self']['href'].lastIndexOf('/') + 1),
            name: x.name,
            version: x.version,
            enableSvm: x.enableSvm,
            enableVulnerabilitiesDisplay: x.enableVulnerabilitiesDisplay,
        })
        if(x._embedded?.['sw360:linkedProjects']) {
            extractLinkedProjects(x._embedded?.['sw360:linkedProjects'], projectData)
        }
    }
}

export default function ProjectVulnerabilities({ projectData }: { projectData: ProjectData }) {
    const { data: session, status } = useSession()
    const [data, setData] = useState<ProjectData[]>([])

    useEffect(() => {
        if (status !== 'authenticated') return

        const controller = new AbortController()
        const signal = controller.signal

        ;(async () => {
            try {
                const response = await ApiUtils.GET(
                    `projects/${projectData.id}/linkedProjects?transitive=true`,
                    session.user.access_token,
                    signal
                )
                if (response.status === HttpStatus.UNAUTHORIZED) {
                    return signOut()
                } else if (response.status !== HttpStatus.OK) {
                    return notFound()
                }

                const data = await response.json()

                const d: ProjectData[] = []
                d.push(projectData)

                extractLinkedProjects(data._embedded?.['sw360:projects'], d)

                setData(d)
            } catch (e) {
                console.error(e)
            }
        })()

        return () => controller.abort(signal)
    }, [status])

    return (
        <>
            <Tabs defaultActiveKey={projectData.id} className='mb-3' mountOnEnter={true} unmountOnExit={true}>
                {data.length !== 0 && <Tab eventKey='summary' title='Summary'></Tab>}
                {data.map((e: ProjectData) => (
                    <Tab eventKey={e.id} key={e.id} title={`${e.name} (${e.version})`}>
                        <VulnerabilityTab projectData={e} />
                    </Tab>
                ))}
            </Tabs>
        </>
    )
}
