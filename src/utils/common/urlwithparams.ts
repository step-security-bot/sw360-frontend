// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.
// Copyright (C) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { useSearchParams } from 'next/navigation'

/**
 * Gets the assembled URL with search parameters.
 *
 * @param baseUrl - The base URL.
 * @param customParams - Custom parameters. Override default searchParams
 * @returns The URL with the search parameters.
 */
export const UrlWithParams = (baseUrl: string, customParams: { [key: string]: string } = {}) => {
    const defaultSearchParams = useSearchParams()
    const searchParams = Object.keys(customParams).length > 0 ? new URLSearchParams(customParams) : defaultSearchParams
    const url = new URL(baseUrl)
    for (const [key, value] of searchParams) {
        url.searchParams.append(key, value)
    }

    return url.toString()
}
