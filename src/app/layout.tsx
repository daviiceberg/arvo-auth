import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Autorizador',
  description: 'Sistema de Autorização de Procedimentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={spaceGrotesk.variable}>
      <body style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
