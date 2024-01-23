// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { ComponentOwner, Release } from '@/object-types'

import CommercialDetailsAdministration from './CommercialDetailsAdministration'
import COTSOSSInformation from './COTSOSSInformation'

interface Props {
    releasePayload?: Release
    setReleasePayload?: React.Dispatch<React.SetStateAction<Release>>
    cotsResponsible?: ComponentOwner
    setCotsResponsible?: React.Dispatch<React.SetStateAction<ComponentOwner>>
}

function AddCommercialDetails({ releasePayload, setReleasePayload, cotsResponsible, setCotsResponsible }: Props) {
    return (
        <>
            <div className='container' style={{ maxWidth: '98vw', marginTop: '10px', fontSize: '0.875rem' }}>
                <CommercialDetailsAdministration
                    releasePayload={releasePayload}
                    setReleasePayload={setReleasePayload}
                    cotsResponsible={cotsResponsible}
                    setCotsResponsible={setCotsResponsible}
                />

                <COTSOSSInformation releasePayload={releasePayload} setReleasePayload={setReleasePayload} />
            </div>
        </>
    )
}

export default AddCommercialDetails
