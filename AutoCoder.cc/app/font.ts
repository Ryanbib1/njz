import { Inter, Orbitron } from 'next/font/google'

export const display = Orbitron({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
})

export const header = Inter({
    subsets: ['latin'],
    variable: '--font-header',
    display: 'swap',
})

export const body = Orbitron({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
})

