'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NovoVeiculoPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')

  const [form, setForm] = useState({
    apelido: '', marca: '', modelo: '', ano: '', placa: '', quilometragem: '',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('veiculos').insert({
      user_id:       user.id,
      apelido:       form.apelido,
      marca:         form.marca,
      modelo:        form.modelo,
      ano:           parseInt(form.ano),
      placa:         form.placa || null,
      quilometragem: parseInt(form.quilometragem) || 0,
    })

    if (error) {
      setErro('Erro ao salvar veículo. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard/veiculos')
    router.refresh()
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/veiculos" className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-[16px] font-medium text-gray-900 mb-5">Novo veículo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Apelido *</label>
            <input
              type="text" value={form.apelido} onChange={e => set('apelido', e.target.value)}
              placeholder="Ex: Meu HB20, Carro da família"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Marca *</label>
              <input
                type="text" value={form.marca} onChange={e => set('marca', e.target.value)}
                placeholder="Hyundai"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Modelo *</label>
              <input
                type="text" value={form.modelo} onChange={e => set('modelo', e.target.value)}
                placeholder="HB20"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Ano *</label>
              <input
                type="number" value={form.ano} onChange={e => set('ano', e.target.value)}
                placeholder="2021" min="1950" max={new Date().getFullYear() + 1}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Placa</label>
              <input
                type="text" value={form.placa} onChange={e => set('placa', e.target.value.toUpperCase())}
                placeholder="ABC-1234"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">Quilometragem atual</label>
            <input
              type="number" value={form.quilometragem} onChange={e => set('quilometragem', e.target.value)}
              placeholder="48200" min="0"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {erro && <p className="text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

          <div className="flex gap-3 pt-1">
            <Link
              href="/dashboard/veiculos"
              className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
