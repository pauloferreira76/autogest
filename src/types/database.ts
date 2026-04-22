export type Veiculo = {
  id: string
  user_id: string
  apelido: string
  marca: string
  modelo: string
  ano: number
  placa: string | null
  quilometragem: number
  created_at: string
}

export type Manutencao = {
  id: string
  veiculo_id: string
  user_id: string
  tipo: string
  descricao: string | null
  data_prevista: string | null
  data_realizada: string | null
  km_previsto: number | null
  custo: number | null
  status: 'pendente' | 'realizada' | 'atrasada'
  created_at: string
}

export type CategoriasDespesa =
  | 'combustivel'
  | 'manutencao'
  | 'seguro'
  | 'multa'
  | 'ipva'
  | 'outros'

export type Despesa = {
  id: string
  veiculo_id: string
  user_id: string
  categoria: CategoriasDespesa
  descricao: string | null
  valor: number
  data: string
  nota_fiscal_url: string | null
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plano: 'free' | 'pro'
  created_at: string
}
