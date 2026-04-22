import { createClient } from '@/lib/supabase-server'
import { formatKm } from '@/lib/utils'
import { Car, Plus, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function VeiculosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: veiculos } = await supabase
    .from('veiculos').select('*').eq('user_id', user!.id).order('created_at')

  return (
    <div className="max-w-4xl">
      {!veiculos || veiculos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Car size={40} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-[16px] font-medium text-gray-900 mb-2">Nenhum veículo cadastrado</h2>
          <p className="text-[13px] text-gray-400 mb-6">Adicione seu primeiro carro para começar.</p>
          <Link
            href="/dashboard/veiculos/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} /> Adicionar veículo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {veiculos.map(v => (
            <Link key={v.id} href={`/dashboard/veiculos/${v.id}`} className="block">
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900">{v.apelido}</h3>
                    <p className="text-[12px] text-gray-400">{v.marca} {v.modelo} · {v.ano}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 mb-0.5">Quilometragem</p>
                    <p className="text-[14px] font-medium text-gray-900">{formatKm(v.quilometragem)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 mb-0.5">Placa</p>
                    <p className="text-[14px] font-medium text-gray-900">{v.placa || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[11px] text-gray-400">
                  <Calendar size={11} />
                  Cadastrado em {new Date(v.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </Link>
          ))}

          {/* Card de adicionar */}
          <Link href="/dashboard/veiculos/novo">
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center min-h-[160px] gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <Plus size={20} className="text-gray-400" />
              </div>
              <p className="text-[13px] text-gray-400 font-medium">Adicionar veículo</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
