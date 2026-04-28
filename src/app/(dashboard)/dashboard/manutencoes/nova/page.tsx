'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Veiculo } from '@/types'

const tiposComuns = [
  'Troca de óleo', 'Revisão dos freios', 'Alinhamento e balanceamento',
  'Troca de pneus', 'Revisão geral', 'Troca de filtro de ar',
  'Troca de velas', 'Revisão da suspensão', 'Outro',
]

export default function NovaManutencaoPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [loading,  setLoading]  = useState(false)
  const [erro,     setErro]     = useState('')
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  const [form, setForm] = useState({
    veiculo_id: '', tipo: '', tipo_custom: '',
    data_prevista: '', km_previsto: '', custo: '', descricao: '',
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

    const tipoFinal = form.tipo === 'Outro' ? form.tipo_custom : form.tipo

    const { error } = await supabase.from('manutencoes').insert({
      user_id:      user.id,
      veiculo_id:   form.veiculo_id,
      tipo:         tipoFinal,
      descricao:    form.descricao || null,
      data_prevista: form.data_prevista || null,
      km_previsto:  form.km_previsto ? parseInt(form.km_previsto) : null,
      custo:        form.custo ? parseFloat(form.custo) : null,
      status:       'pendente',
    })

    if (error) {
      setErro('Erro ao salvar manutenção. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard/manutencoes')
    router.refresh()
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/manutencoes" className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-[16px] font-medium text-gray-900 mb-5">Agendar manutenção</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Veículo *</label>
            <select value={form.veiculo_id} onChange={e => set('veiculo_id', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Tipo de manutenção *</label>
            <select value={form.tipo} onChange={e => set('tipo', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Selecione...</option>
              {tiposComuns.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {form.tipo === 'Outro' && (
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Descreva o tipo *</label>
              <input type="text" value={form.tipo_custom} onChange={e => set('tipo_custom', e.target.value)}
                placeholder="Ex: Troca da correia dentada" required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Data prevista</label>
              <input type="date" value={form.data_prevista} onChange={e => set('data_prevista', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">KM previsto</label>
              <input type="number" value={form.km_previsto} onChange={e => set('km_previsto', e.target.value)}
                placeholder="50000" min="0"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Custo estimado (R$)</label>
            <input type="number" value={form.custo} onChange={e => set('custo', e.target.value)}
              placeholder="350.00" min="0" step="0.01"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Observações</label>
            <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)}
              placeholder="Detalhes adicionais..." rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {erro && <p className="text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

          <div className="flex gap-3 pt-1">
            <Link href="/dashboard/manutencoes" className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
