import type { Metadata, Viewport } from 'next'
import './globals.css'
import './landing.css'

export const metadata: Metadata = {
  title: 'AutoGest — Gestão Automotiva Inteligente',
  description: 'Controle manutenções, despesas e tenha insights com IA para seus veículos.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
