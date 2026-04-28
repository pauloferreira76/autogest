import { createClient } from '@/lib/supabase-server'
import { formatCurrency, formatDate, categoriasLabel, categoriasCor } from '@/lib/utils'
import { DollarSign, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DespesasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: despesas }, { data: veiculos }] = await Promise.all([
    supabase.from('despesas').select('*, veiculos(apelido)').eq('user_id', user!.id).order('data', { ascending: false }),
    supabase.from('veiculos').select('id, apelido').eq('user_id', user!.id),
  ])

  const total = (despesas ?? []).reduce((acc, d) => acc + Number(d.valor), 0)

  return (
    <div className="max-w-4xl">
      {/* Totalizador */}
      {despesas && despesas.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[12px] text-gray-400 mb-1">Total gasto</p>
            <p className="text-[22px] font-semibold text-gray-900">{formatCurrency(total)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[12px] text-gray-400 mb-1">Registros</p>
            <p className="text-[22px] font-semibold text-gray-900">{despesas.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[12px] text-gray-400 mb-1">Média por registro</p>
            <p className="text-[22px] font-semibold text-gray-900">
              {formatCurrency(total / despesas.length)}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[14px] font-medium text-gray-900">Histórico de despesas</h2>
          <Link
            href="/dashboard/despesas/nova"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} /> Nova despesa
          </Link>
        </div>

        {!despesas || despesas.length === 0 ? (
          <div className="p-16 text-center">
            <DollarSign size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-gray-900 mb-1">Nenhuma despesa registrada</p>
            <p className="text-[13px] text-gray-400 mb-5">Registre seus gastos para ter controle financeiro.</p>
            <Link
              href="/dashboard/despesas/nova"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} /> Registrar despesa
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {despesas.map((d: any) => (
              <div key={d.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900">{d.descricao || categoriasLabel[d.categoria as keyof typeof categoriasLabel]}</p>
                  <p className="text-[11px] text-gray-400">{d.veiculos?.apelido} · {formatDate(d.data)}</p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${categoriasCor[d.categoria as keyof typeof categoriasCor]}`}>
                  {categoriasLabel[d.categoria as keyof typeof categoriasLabel]}
                </span>
                <p className="text-[14px] font-semibold text-gray-900 flex-shrink-0 w-24 text-right">
                  {formatCurrency(Number(d.valor))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
