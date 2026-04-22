import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoGest — Gestão Automotiva Inteligente',
  description: 'Controle manutenções, despesas e tenha insights com IA para seus veículos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
