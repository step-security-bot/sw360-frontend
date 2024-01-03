// tailwind.config.js
import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    darkMode: 'class',
    plugins: [
        nextui({
            themes: {
                dark: {
                    colors: {
                        default: {
                            DEFAULT: '#f7941e',
                            foreground: '#22272e',
                        },
                    },
                },
                light: {
                    colors: {
                        default: {
                            DEFAULT: '#f7941e',
                            foreground: '#22272e',
                        },
                    },
                },
            },
        }),
    ],
}
