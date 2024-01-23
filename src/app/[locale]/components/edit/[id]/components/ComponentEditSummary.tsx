// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { notFound } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { AddAdditionalRoles, AddKeyValue } from 'next-sw360'
import { useCallback, useEffect, useState } from 'react'

import GeneralInfoComponent from '@/components/GeneralInfoComponent/GeneralInfoComponent'
import RolesInformation from '@/components/RolesInformation/RolesInformation'
import {
    Attachment,
    Component,
    ComponentOwner,
    ComponentPayload,
    DocumentTypes,
    HttpStatus,
    InputKeyValue,
    Moderators,
    Vendor,
} from '@/object-types'
import { ApiUtils, CommonUtils } from '@/utils'

interface Props {
    componentId?: string
    componentPayload?: ComponentPayload
    setComponentPayload?: React.Dispatch<React.SetStateAction<ComponentPayload>>
    attachmentData?: Array<Attachment>
}

export default function ComponentEditSummary({
    componentId,
    componentPayload,
    setComponentPayload,
    attachmentData,
}: Props) {
    const t = useTranslations('default')
    const { data: session } = useSession()
    const [externalIds, setExternalIds] = useState<InputKeyValue[]>([])
    const [addtionalData, setAddtionalData] = useState<InputKeyValue[]>([])
    const [vendor, setVendor] = useState<Vendor>({
        id: '',
        fullName: '',
    })

    const [componentOwner, setComponentOwner] = useState<ComponentOwner>({
        email: '',
        fullName: '',
    })

    const [moderator, setModerator] = useState<Moderators>({
        emails: null,
        fullName: '',
    })

    const fetchData = useCallback(
        async (url: string) => {
            const response = await ApiUtils.GET(url, session.user.access_token)
            if (response.status == HttpStatus.OK) {
                const data = (await response.json()) as Component
                return data
            } else if (response.status == HttpStatus.UNAUTHORIZED) {
                return signOut()
            } else {
                notFound()
            }
        },
        [session.user.access_token],
    )

    useEffect(() => {
        void fetchData(`components/${componentId}`).then((component: Component) => {
            if (typeof component.externalIds !== 'undefined') {
                setExternalIds(CommonUtils.convertObjectToMap(component.externalIds))
            }

            if (typeof component.additionalData !== 'undefined') {
                setAddtionalData(CommonUtils.convertObjectToMap(component.additionalData))
            }

            if (typeof component._embedded['sw360:moderators'] !== 'undefined') {
                setModerator(CommonUtils.getObjectModerators(component._embedded['sw360:moderators']))
            }

            if (typeof component._embedded.defaultVendor !== 'undefined') {
                const vendor: Vendor = {
                    id: component.defaultVendorId,
                    fullName: component._embedded.defaultVendor.fullName,
                }
                setVendor(vendor)
            }

            if (typeof component._embedded.componentOwner !== 'undefined') {
                const componentOwner: ComponentOwner = {
                    email: component._embedded.componentOwner.email,
                    fullName: component._embedded.componentOwner.fullName,
                }
                setComponentOwner(componentOwner)
            }

            let modifiedBy = ''
            if (typeof component._embedded.modifiedBy !== 'undefined') {
                modifiedBy = component._embedded.modifiedBy.fullName
            }

            let creatBy = ''
            if (typeof component._embedded.createdBy !== 'undefined') {
                creatBy = component._embedded.createdBy.fullName
            }

            let componentOwnerEmail = ''
            if (typeof component._embedded.componentOwner !== 'undefined') {
                componentOwnerEmail = component._embedded.componentOwner.email
            }

            const componentPayloadData: ComponentPayload = {
                name: component.name,
                createBy: creatBy,
                description: component.description,
                componentType: component.componentType,
                moderators: CommonUtils.getEmailsModerators(component._embedded['sw360:moderators']),
                modifiedBy: modifiedBy,
                modifiedOn: component.modifiedOn,
                componentOwner: componentOwnerEmail,
                ownerAccountingUnit: component.ownerAccountingUnit,
                ownerGroup: component.ownerGroup,
                ownerCountry: component.ownerCountry,
                roles: CommonUtils.convertRoles(CommonUtils.convertObjectToMapRoles(component.roles)),
                externalIds: component.externalIds,
                additionalData: component.additionalData,
                defaultVendorId: component.defaultVendorId,
                categories: component.categories,
                homepage: component.homepage,
                mailinglist: component.mailinglist,
                wiki: component.wiki,
                blog: component.blog,
                attachmentDTOs: attachmentData,
            }
            setComponentPayload(componentPayloadData)
        })
    }, [componentId, fetchData, attachmentData, setComponentPayload])

    const setDataAddtionalData = (additionalDatas: Map<string, string>) => {
        const obj = Object.fromEntries(additionalDatas)
        setComponentPayload({
            ...componentPayload,
            additionalData: obj,
        })
    }

    const setDataExternalIds = (externalIds: Map<string, string>) => {
        const obj = Object.fromEntries(externalIds)
        setComponentPayload({
            ...componentPayload,
            externalIds: obj,
        })
    }

    return (
        <>
            <form
                action=''
                id='form_submit'
                method='post'
                onSubmit={(e) => {
                    e.preventDefault()
                }}
            >
                <div className='col'>
                    <div className='col'>
                        <GeneralInfoComponent
                            vendor={vendor}
                            setVendor={setVendor}
                            componentPayload={componentPayload}
                            setComponentPayload={setComponentPayload}
                        />
                        <RolesInformation
                            componentOwner={componentOwner}
                            setComponentOwner={setComponentOwner}
                            moderator={moderator}
                            setModerator={setModerator}
                            componentPayload={componentPayload}
                            setComponentPayload={setComponentPayload}
                        />
                        <div className='row mb-4'>
                            <AddAdditionalRoles documentType={DocumentTypes.COMPONENT} />
                        </div>
                        <div className='row mb-4'>
                            <AddKeyValue
                                header={t('External ids')}
                                keyName={'external id'}
                                setData={setExternalIds}
                                data={externalIds}
                                setObject={setDataExternalIds}
                            />
                        </div>
                        <div className='row mb-4'>
                            <AddKeyValue
                                header={t('Additional Data')}
                                keyName={'additional data'}
                                setData={setAddtionalData}
                                data={addtionalData}
                                setObject={setDataAddtionalData}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
