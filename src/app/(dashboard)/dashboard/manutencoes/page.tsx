import { createClient } from '@/lib/supabase-server'
import { formatDate, formatCurrency, statusCor } from '@/lib/utils'
import { Wrench, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ManutencoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manutencoes } = await supabase
    .from('manutencoes')
    .select('*, veiculos(apelido)')
    .eq('user_id', user!.id)
    .order('data_prevista', { ascending: true })

  const statusLabel: Record<string, string> = {
    pendente: 'Pendente', realizada: 'Realizada', atrasada: 'Atrasada',
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[14px] font-medium text-gray-900">Manutenções</h2>
          <Link
            href="/dashboard/manutencoes/nova"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} /> Agendar
          </Link>
        </div>

        {!manutencoes || manutencoes.length === 0 ? (
          <div className="p-16 text-center">
            <Wrench size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-gray-900 mb-1">Nenhuma manutenção cadastrada</p>
            <p className="text-[13px] text-gray-400 mb-5">Agende revisões e serviços para receber alertas.</p>
            <Link
              href="/dashboard/manutencoes/nova"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} /> Agendar manutenção
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {manutencoes.map((m: any) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wrench size={14} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900">{m.tipo}</p>
                  <p className="text-[11px] text-gray-400">
                    {m.veiculos?.apelido}
                    {m.data_prevista ? ` · Previsto: ${formatDate(m.data_prevista)}` : ''}
                    {m.data_realizada ? ` · Realizado: ${formatDate(m.data_realizada)}` : ''}
                  </p>
                </div>
                {m.custo && (
                  <p className="text-[13px] text-gray-600 flex-shrink-0">{formatCurrency(Number(m.custo))}</p>
                )}
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusCor[m.status]}`}>
                  {statusLabel[m.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
