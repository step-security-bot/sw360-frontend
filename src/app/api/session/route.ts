/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: any = await auth()

    if (session === null) {
        return new NextResponse(JSON.stringify({ status: 'fail', message: 'You are not logged in' }), { status: 401 })
    }

    // Session is already authenticated at this stage
    return NextResponse.json({
        authenticated: true,
        session,
    })
}
1
