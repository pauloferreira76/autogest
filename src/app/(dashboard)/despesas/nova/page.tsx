'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { categoriasLabel } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Veiculo, CategoriasDespesa } from '@/types'

export default function NovaDespesaPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [loading,  setLoading]  = useState(false)
  const [erro,     setErro]     = useState('')
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  const [form, setForm] = useState({
    veiculo_id: '', categoria: 'combustivel' as CategoriasDespesa,
    descricao: '', valor: '', data: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('veiculos').select('*').eq('user_id', user.id).then(({ data }) => {
        if (data) {
          setVeiculos(data)
          if (data.length > 0) setForm(prev => ({ ...prev, veiculo_id: data[0].id }))
        }
      })
    })
  }, [])

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('despesas').insert({
      user_id:    user.id,
      veiculo_id: form.veiculo_id,
      categoria:  form.categoria,
      descricao:  form.descricao || null,
      valor:      parseFloat(form.valor),
      data:       form.data,
    })

    if (error) {
      setErro('Erro ao salvar despesa. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard/despesas')
    router.refresh()
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/despesas" className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-[16px] font-medium text-gray-900 mb-5">Nova despesa</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Veículo *</label>
            <select
              value={form.veiculo_id} onChange={e => set('veiculo_id', e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {veiculos.length === 0 && <option value="">Carregando...</option>}
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Categoria *</label>
            <select
              value={form.categoria} onChange={e => set('categoria', e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {Object.entries(categoriasLabel).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Descrição</label>
            <input
              type="text" value={form.descricao} onChange={e => set('descricao', e.target.value)}
              placeholder="Ex: Abastecimento posto Shell"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Valor (R$) *</label>
              <input
                type="number" value={form.valor} onChange={e => set('valor', e.target.value)}
                placeholder="150.00" min="0.01" step="0.01"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date" value={form.data} onChange={e => set('data', e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {erro && <p className="text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

          <div className="flex gap-3 pt-1">
            <Link href="/dashboard/despesas" className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
