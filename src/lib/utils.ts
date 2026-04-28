import { CategoriasDespesa } from '@/types'

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
export function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}
export function formatKm(km: number): string {
  return `${km.toLocaleString('pt-BR')} km`
}
export function getInitials(name: string, email: string): string {
  if (name) return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  return email.slice(0, 2).toUpperCase()
}
export function getSaudacao(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const categoriasLabel: Record<CategoriasDespesa, string> = {
  combustivel: 'Combustível',
  manutencao:  'Manutenção',
  seguro:      'Seguro',
  multa:       'Multa',
  ipva:        'IPVA',
  outros:      'Outros',
}

export const categoriasCor: Record<CategoriasDespesa, string> = {
  combustivel: 'badge-amber',
  manutencao:  'badge-brand',
  seguro:      'badge-violet',
  multa:       'badge-rose',
  ipva:        'badge-emerald',
  outros:      'badge-gray',
}

export const statusCor: Record<string, string> = {
  pendente:  'badge badge-amber',
  realizada: 'badge badge-emerald',
  atrasada:  'badge badge-rose',
}
