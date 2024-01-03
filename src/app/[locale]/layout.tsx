// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import 'flag-icons/css/flag-icons.min.css'

import '@/styles/gridjs/sw360.css'

import '@/styles/auth.css'
import '@/styles/globals.css'

import { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

import { LOCALES } from '@/constants'
import { Navbar } from '@sw360'
import { Footer } from 'next-sw360'
import { Providers } from '../provider'

export const metadata: Metadata = {
    title: {
        template: '%s | SW360 Frontend',
        default: 'SW360 Frontend',
    },
    description: 'SW360 Compliance Management System Graphical Interface.',
    metadataBase: new URL('https://eclipse.org/sw360/'),
}

export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale: locale.i18n }))
}

type Props = {
    children: ReactNode
    params: { locale: string }
}

async function RootLayout({ children, params: { locale } }: Props) {
    let messages
    try {
        messages = (await import(`@/messages/${locale}.json`)).default
    } catch (error) {
        notFound()
    }

    unstable_setRequestLocale(locale)

    return (
        <html lang={locale}>
            <body>
                <Providers>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <div>
                            <div>
                                <Navbar />
                                {children}
                                <Footer />
                            </div>
                        </div>
                    </NextIntlClientProvider>
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout
