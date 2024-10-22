// Copyright (C) TOSHIBA CORPORATION, 2023. Part of the SW360 Frontend Project.
// Copyright (C) Toshiba Software Development (Vietnam) Co., Ltd., 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'
import { ApiUtils, CommonUtils } from '@/utils/index'
import { getSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { notFound, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { LicensePayload, HttpStatus, LicenseType, Embedded } from '@/object-types'
import styles from './LicenseDetails.module.css'

interface Props {
    licensePayload: LicensePayload
    setLicensePayload: React.Dispatch<React.SetStateAction<LicensePayload>>
    errorShortName: boolean
    errorFullName: boolean
    inputValid: boolean
    setErrorShortName: React.Dispatch<React.SetStateAction<boolean>>
    setErrorFullName: React.Dispatch<React.SetStateAction<boolean>>
}

type EmbeddedLicenseTypes = Embedded<LicenseType, 'sw360:licenseTypes'>

const AddLicenseDetail = ({
    licensePayload,
    setLicensePayload,
    errorShortName,
    errorFullName,
    inputValid,
    setErrorShortName,
    setErrorFullName,
}: Props) : ReactNode => {
    const [regexError, setRegexError] = useState(false)
    const t = useTranslations('default')
    const params = useSearchParams()
    const [licenseTypes, setLicenseTypes] = useState<Array<LicenseType>>([])
    const validateShortName = (value: string) => {
        return value.match(/^[A-Za-z0-9\-.+]*$/) ? false : true;
    }

    const updateField = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === 'shortName') {
            const value = e.target.value
            setErrorShortName(false)
            setRegexError(validateShortName(value))
        }
        if (e.target.name === 'fullName') {
            setErrorFullName(false)
        }
        setLicensePayload({
            ...licensePayload,
            [e.target.name]: e.target.value,
        })
    }

    const updateFieldChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLicensePayload({
            ...licensePayload,
            [e.target.name]: e.target.checked,
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        void (async () => {
            try {
                const session = await getSession()
                if (CommonUtils.isNullOrUndefined(session))
                    return
                const response = await ApiUtils.GET(`licenseTypes`, session.user.access_token, signal)
                if (response.status === HttpStatus.UNAUTHORIZED) {
                    return signOut()
                } else if (response.status !== HttpStatus.OK) {
                    return notFound()
                }
                const licenses = await response.json() as EmbeddedLicenseTypes
                setLicenseTypes(licenses._embedded['sw360:licenseTypes'])
            } catch (e) {
                console.error(e)
            }
        })()
        return () => controller.abort()
    }, [params])

    return (
        <div className='row mb-4' style={{ padding: '0px 12px', fontSize: '14px' }}>
            <div className={`${styles['header']} mb-1`} style={{ paddingTop: '0.5rem', height: '45px' }}>
                <p className='fw-bold mt-1' style={{ fontSize: '0.875rem' }}>
                    {t('License Details')}
                </p>
            </div>
            <div style={{ backgroundColor: '#FFF', borderBottom: '1px solid #DCDCDC' }}>
                <div className='row' style={{ paddingBottom: '0.7rem' }}>
                    <div className='col-lg-4'>
                        <label htmlFor='fullName' className='form-label fw-bold' style={{ cursor: 'pointer' }}>
                            {t('Fullname')}
                            <span className='text-red' style={{ color: '#F7941E' }}>
                                *
                            </span>
                        </label>
                        <input
                            type='text'
                            className={`form-control ${errorFullName ? 'is-invalid' : ''} ${
                                !errorFullName && inputValid ? 'is-valid' : ''
                            }`}
                            placeholder='Enter Fullname'
                            id='fullName'
                            required
                            aria-describedby='fullName'
                            name='fullName'
                            value={licensePayload.fullName ?? ''}
                            onChange={updateField}
                        />
                    </div>
                    <div className='col-lg-4'>
                        <label htmlFor='shortName' className='form-label fw-bold' style={{ cursor: 'pointer' }}>
                            {t('Shortname')}
                            <span className='text-red' style={{ color: '#F7941E' }}>
                                *
                            </span>
                        </label>

                        <input
                            type='text'
                            className={`form-control ${errorShortName ? 'is-invalid' : ''} ${
                                regexError ? 'is-invalid' : ''
                            } ${!errorShortName && inputValid ? 'is-valid' : ''}`}
                            placeholder='Enter Shortname'
                            id='shortName'
                            required
                            aria-describedby='shortName'
                            name='shortName'
                            value={licensePayload.shortName ?? ''}
                            onChange={updateField}
                            title='1*(ALPHA / DIGIT / "-" / "." / "+" )'
                        />
                    </div>
                    <div className='col-lg-4'>
                        <label
                            htmlFor='licenseTypeDatabaseId'
                            className='form-label fw-bold'
                            style={{ cursor: 'pointer' }}
                        >
                            {t('License Type')}{' '}
                        </label>
                        <select
                            className={`form-control ${inputValid ? 'is-valid' : ''}`}
                            aria-label='licenseTypeDatabaseId'
                            id='licenseTypeDatabaseId'
                            required
                            name='licenseTypeDatabaseId'
                            onChange={updateField}
                        >
                            <option value=''>{t('No type selected')}</option>
                            {licenseTypes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.licenseType}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#FFF', borderBottom: '1px solid #DCDCDC' }}>
                <div className='row' style={{ paddingBottom: '0.7rem' }}>
                    <div className='col-lg-4'>
                        <label htmlFor='OSIApproved' className='form-label fw-bold' style={{ cursor: 'pointer' }}>
                            {t('OSI Approved?')}{' '}
                        </label>
                        <select
                            className={`form-control ${inputValid ? 'is-valid' : ''}`}
                            aria-label='OSIApproved'
                            id='OSIApproved'
                            required
                            name='OSIApproved'
                            onChange={updateField}
                            value={licensePayload.OSIApproved ?? ''}
                        >
                            <option value='NA'>{t('(n/a)')}</option>
                            <option value='YES'>{t('yes')}</option>
                        </select>
                    </div>
                    <div className='col-lg-4'>
                        <label htmlFor='FSFLibre' className='form-label fw-bold' style={{ cursor: 'pointer' }}>
                            {t('FSF Free/Libre?')}{' '}
                        </label>
                        <select
                            className={`form-control ${inputValid ? 'is-valid' : ''}`}
                            aria-label='FSFLibre'
                            id='FSFLibre'
                            required
                            name='FSFLibre'
                            value={licensePayload.FSFLibre ?? ''}
                            onChange={updateField}
                        >
                            <option value='NA'>{t('(n/a)')}</option>
                            <option value='YES'>{t('yes')}</option>
                        </select>
                    </div>
                    <div className='col-lg-4'>
                        <div className='form-check'>
                            <input
                                id='isChecked'
                                type='checkbox'
                                className='form-check-input'
                                name='checked'
                                checked={licensePayload.checked ?? false}
                                onChange={updateFieldChecked}
                            />
                            <label className='form-label fw-bold' htmlFor='isChecked' style={{ cursor: 'pointer' }}>
                                {t('Is checked')}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: '#FFF', borderBottom: '1px solid #DCDCDC', width: '495px' }}>
                <div className='row' style={{ paddingBottom: '0.7rem' }}>
                    <div className='col-lg-12'>
                        <label htmlFor='note' className='form-label fw-bold' style={{ cursor: 'pointer' }}>
                            {t('Note')}
                        </label>
                        <textarea
                            className={`form-control ${inputValid ? 'is-valid' : ''}`}
                            placeholder='Enter Note'
                            id='note'
                            aria-describedby='note'
                            name='note'
                            value={licensePayload.note ?? ''}
                            onChange={updateField}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddLicenseDetail
