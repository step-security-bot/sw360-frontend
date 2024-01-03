// Copyright (C) Siemens AG, 2023. Part of the SW360 Frontend Project.
// Copyright (c) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { useState } from 'react'
import { Navbar as BSNavbar, Container, Form, Nav, NavDropdown } from 'react-bootstrap'

import sw360logo from '@/assets/images/sw360-logo.svg'
import { NavList } from '@/object-types'
import { ThemeSwitcher } from '@sw360'
import { LocaleSwitcher, ProfileDropdown } from 'next-sw360'

function Navbar() {
    const router = useRouter()

    const { data: session, status } = useSession()
    const [show, setShow] = useState(false)
    const selectedLayoutSegment = useSelectedLayoutSegment()
    const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'

    const navlist = NavList()

    // NavItems receives an array of links with possible entries:
    // href: the link (mandatory)
    // name: the name of the link (mandatory)
    // id: the id of the link (mandatory)
    // visibility: the userGroup that is allowed to see the link (optional)
    // childs: an array of links that are shown as dropdown menu (optional)

    const NavItems = () => (
        <>
            {navlist.map((item) => {
                if ('visibility' in item) {
                    if (status === 'authenticated' && session.user.userGroup !== item.visibility) {
                        return
                    }
                }
                if ('childs' in item) {
                    return (
                        <NavDropdown
                            title={item.name}
                            id={item.id}
                            show={show}
                            onMouseEnter={() => setShow(true)}
                            onMouseLeave={() => setShow(false)}
                            key={item.name}
                            className={`${pathname == item.href ? 'active' : ''}`}
                            active={pathname == item.href}
                            onClick={(e) => {
                                // hack to route to /admin when clicked on dropdown title
                                if ((e.target as HTMLElement).attributes[0].name === 'id') {
                                    e.preventDefault()
                                    router.push(item.href)
                                }
                            }}
                        >
                            {item.childs.map((child) => (
                                <NavDropdown.Item href={child.href} key={child.id}>
                                    {child.name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                    )
                } else {
                    return (
                        <Nav.Item key={item.name}>
                            <Link className={`nav-link ${pathname == item.href ? 'active' : ''}`} href={item.href}>
                                {item.name}
                            </Link>
                        </Nav.Item>
                    )
                }
            })}
        </>
    )

    return (
        <>
            <BSNavbar>
                <Container style={{ marginLeft: 0 }}>
                    <BSNavbar.Brand href='/'>
                        <Image src={sw360logo} height={57} width={147} alt='SW360 Logo' />
                    </BSNavbar.Brand>
                    {pathname != '/' && (
                        <Nav className='me-auto'>
                            <NavItems />
                        </Nav>
                    )}
                </Container>
                {pathname != '/' ? (
                    <Form className='d-flex justify-content-end align-items-center'>
                        <Form.Control type='text' placeholder='Search' className='me-2' />
                        <ProfileDropdown className='me-2 sw360-colors' />
                        <LocaleSwitcher className='me-2 sw360-colors' />
                        <ThemeSwitcher className='me-3' />
                    </Form>
                ) : (
                    <Form className='d-flex justify-content-end align-items-center'>
                        <ThemeSwitcher className='me-4' />
                    </Form>
                )}
            </BSNavbar>
        </>
    )
}

export default Navbar
