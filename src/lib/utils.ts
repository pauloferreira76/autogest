import { CategoriasDespesa } from '@/types'

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function formatKm(km: number): string {
  return `${km.toLocaleString('pt-BR')} km`
}

export function getInitials(name: string, email: string): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function getSaudacao(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const categoriasLabel: Record<CategoriasDespesa, string> = {
  combustivel: 'Combustível',
  manutencao: 'Manutenção',
  seguro: 'Seguro',
  multa: 'Multa',
  ipva: 'IPVA',
  outros: 'Outros',
}

export const categoriasCor: Record<CategoriasDespesa, string> = {
  combustivel: 'bg-amber-50 text-amber-700',
  manutencao:  'bg-blue-50 text-blue-700',
  seguro:      'bg-purple-50 text-purple-700',
  multa:       'bg-red-50 text-red-700',
  ipva:        'bg-green-50 text-green-700',
  outros:      'bg-gray-100 text-gray-600',
}

export const statusCor: Record<string, string> = {
  pendente:  'bg-amber-50 text-amber-700',
  realizada: 'bg-green-50 text-green-700',
  atrasada:  'bg-red-50 text-red-700',
}
