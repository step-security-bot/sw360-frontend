// Copyright (C) Helio Chissini de Castro, 2023. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { Button as NextUIButton } from '@nextui-org/react'

function Button({ ...props }) {
    return (
        <NextUIButton
            radius='sm'
            size='md'
            {...props} // Pass the rest of the props to the NextUI button component
        />
    )
}

Button.displayName = 'Button'

export default Button
