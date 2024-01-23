// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { Attachment, ComponentPayload, DocumentTypes, HttpStatus, Release } from '@/object-types'
import { ApiUtils, CommonUtils } from '@/utils'

import styles from './Attachment.module.css'
import SelectAttachment from './SelectAttachment/SelectAttachment'
import TableAttachment from './TableAttachment/TableAttachment'
import TitleAttachment from './TiltleAttachment/TitleAttachment'

interface Props {
    documentId?: string
    documentType?: string
    componentPayload?: ComponentPayload
    setComponentPayload?: React.Dispatch<React.SetStateAction<ComponentPayload>>
    releasePayload?: Release
    setReleasePayload?: React.Dispatch<React.SetStateAction<Release>>
}

function EditAttachments({
    documentId,
    documentType,
    componentPayload,
    setComponentPayload,
    releasePayload,
    setReleasePayload,
}: Props) {
    const t = useTranslations('default')
    const { data: session } = useSession()
    const [attachmentData, setAttachmentData] = useState<Array<Attachment>>([])
    const [reRender, setReRender] = useState(false)
    const handleReRender = () => {
        setReRender(!reRender)
    }
    const [dialogOpenSelectAttachment, setDialogOpenSelectAttachment] = useState(false)
    const handleClickSelectAttachment = useCallback(() => setDialogOpenSelectAttachment(true), [])

    // const setAttachmentToComponentData = (attachmentDatas: AttachmentDetail[]) => {
    //     setComponentPayload({
    //         ...componentPayload,
    //         attachmentDTOs: attachmentDatas,
    //     })
    // }

    // const setAttachmentToReleasePayload = (attachmentDatas: AttachmentDetail[]) => {
    //     setReleasePayload({
    //         ...releasePayload,
    //         attachmentDTOs: attachmentDatas,
    //     })
    // }

    const fetchData: any = useCallback(
        async (url: string) => {
            const response = await ApiUtils.GET(url, session.user.access_token)
            if (response.status == HttpStatus.OK) {
                const data = await response.json()
                return data
            } else if (response.status == HttpStatus.UNAUTHORIZED) {
                signOut()
            } else {
                return []
            }
        },
        [session.user.access_token],
    )

    useEffect(() => {
        fetchData(`${documentType}/${documentId}/attachments`).then((attachments: any) => {
            if (
                !CommonUtils.isNullOrUndefined(attachments['_embedded']) &&
                !CommonUtils.isNullOrUndefined(attachments['_embedded']['sw360:attachmentDTOes'])
            ) {
                const attachmentDetails: Array<Attachment> = []
                attachments['_embedded']['sw360:attachmentDTOes'].map((item: any) => {
                    attachmentDetails.push(item)
                })
                setAttachmentData(attachmentDetails)
                if (documentType === DocumentTypes.COMPONENT) {
                    setComponentPayload({
                        ...componentPayload,
                        attachmentDTOs: attachmentDetails,
                    })
                }
            }
        })
    }, [documentId, documentType, fetchData])

    return (
        <>
            <SelectAttachment
                componentPayload={componentPayload}
                setComponentPayload={setComponentPayload}
                attachmentUpload={attachmentData}
                setAttachmentFromUpload={setAttachmentData}
                show={dialogOpenSelectAttachment}
                setShow={setDialogOpenSelectAttachment}
                onReRender={handleReRender}
                documentType={documentType}
                releasePayload={releasePayload}
                setReleasePayload={setReleasePayload}
            />
            <div className={`row ${styles['attachment-table']}`} style={{ padding: '25px' }}>
                <TitleAttachment />
                <TableAttachment
                    data={attachmentData}
                    setAttachmentData={setAttachmentData}
                    // setAttachmentToComponentData={setAttachmentToComponentData}
                    documentType={documentType}
                    // setAttachmentToReleasePayload={setAttachmentToReleasePayload}
                />
            </div>

            <div>
                <button type='button' onClick={handleClickSelectAttachment} className={`fw-bold btn btn-secondary`}>
                    {t('Add Attachment')}
                </button>
            </div>
        </>
    )
}

export default EditAttachments
