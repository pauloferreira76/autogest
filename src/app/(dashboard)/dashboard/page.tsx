import { createClient } from '@/lib/supabase-server'
import { formatCurrency, formatKm, statusCor } from '@/lib/utils'
import { Car, Wrench, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: veiculos }, { data: despesas }, { data: manutencoes }] = await Promise.all([
    supabase.from('veiculos').select('*').eq('user_id', user!.id).order('created_at'),
    supabase.from('despesas').select('valor, data, categoria').eq('user_id', user!.id),
    supabase.from('manutencoes').select('*').eq('user_id', user!.id).order('data_prevista'),
  ])

  const agora     = new Date()
  const inicioMes = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-01`
  const gastoMes  = (despesas ?? [])
    .filter(d => d.data >= inicioMes)
    .reduce((acc, d) => acc + Number(d.valor), 0)

  const pendentes = (manutencoes ?? []).filter(m => m.status !== 'realizada')
  const atrasadas = (manutencoes ?? []).filter(m => m.status === 'atrasada')

  const metrics = [
    {
      label: 'Veículos',
      value: veiculos?.length ?? 0,
      sub: veiculos?.length ? veiculos.map(v => v.apelido).join(' · ') : 'Nenhum cadastrado',
      icon: Car,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Gasto este mês',
      value: formatCurrency(gastoMes),
      sub: agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Manutenções pendentes',
      value: pendentes.length,
      sub: pendentes.length === 0 ? 'Tudo em dia ✓' : `${atrasadas.length} atrasada(s)`,
      icon: Wrench,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Alertas',
      value: atrasadas.length,
      sub: atrasadas.length === 0 ? 'Sem alertas' : 'Requer atenção',
      icon: AlertTriangle,
      color: atrasadas.length > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400',
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${m.color}`}>
              <m.icon size={18} />
            </div>
            <p className="text-[12px] text-gray-400 mb-0.5">{m.label}</p>
            <p className="text-[22px] font-semibold text-gray-900 leading-tight">{m.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Estado vazio — sem veículos */}
      {(!veiculos || veiculos.length === 0) && (
        <div className="bg-blue-50 rounded-xl p-10 text-center border border-blue-100">
          <Car size={36} className="text-blue-300 mx-auto mb-3" />
          <h2 className="text-[15px] font-medium text-blue-900 mb-1">Adicione seu primeiro veículo</h2>
          <p className="text-[13px] text-blue-500 mb-5">
            Cadastre seu carro para começar a rastrear manutenções e despesas.
          </p>
          <Link
            href="/dashboard/veiculos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Car size={14} /> Cadastrar veículo
          </Link>
        </div>
      )}

      {/* Grid principal */}
      {veiculos && veiculos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Veículos */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-medium text-gray-900">Seus veículos</h2>
              <Link href="/dashboard/veiculos" className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {veiculos.map(v => (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900">{v.apelido}</p>
                    <p className="text-[11px] text-gray-400">{v.marca} {v.modelo} · {v.ano}</p>
                  </div>
                  <p className="text-[12px] text-gray-400 flex-shrink-0">{formatKm(v.quilometragem)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Próximas manutenções */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-medium text-gray-900">Próximas manutenções</h2>
              <Link href="/dashboard/manutencoes" className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>
            {pendentes.length === 0 ? (
              <div className="text-center py-6">
                <Wrench size={24} className="text-gray-200 mx-auto mb-2" />
                <p className="text-[13px] text-gray-400">Nenhuma manutenção pendente</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pendentes.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900">{m.tipo}</p>
                      <p className="text-[11px] text-gray-400">
                        {m.data_prevista
                          ? new Date(m.data_prevista + 'T00:00:00').toLocaleDateString('pt-BR')
                          : 'Sem data definida'}
                      </p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusCor[m.status]}`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
