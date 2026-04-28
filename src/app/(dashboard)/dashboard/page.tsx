import { createClient } from '@/lib/supabase-server'
import { formatCurrency, formatKm } from '@/lib/utils'
import { Car, Wrench, DollarSign, Sparkles, ArrowRight, Info } from 'lucide-react'
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
  const gastoMes  = (despesas ?? []).filter(d => d.data >= inicioMes).reduce((s, d) => s + Number(d.valor), 0)
  const pendentes = (manutencoes ?? []).filter(m => m.status !== 'realizada')
  const atrasadas = (manutencoes ?? []).filter(m => m.status === 'atrasada')
  const totalGeral = (despesas ?? []).reduce((s, d) => s + Number(d.valor), 0)

  return (
    <div className="flex flex-col gap-5 max-w-5xl">

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Veículos', value: veiculos?.length ?? 0, sub: veiculos?.map(v => v.apelido).join(', ') || 'Nenhum cadastrado', accent: 'accent-brand', iconBg: 'var(--brand-bg)', icon: Car, iconColor: 'var(--brand)' },
          { label: 'Gasto este mês', value: formatCurrency(gastoMes), sub: agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }), accent: 'accent-emerald', iconBg: 'var(--emerald-bg)', icon: DollarSign, iconColor: 'var(--emerald)' },
          { label: 'Manutenções pendentes', value: pendentes.length, sub: pendentes.length === 0 ? 'Tudo em dia ✓' : `${atrasadas.length} atrasada(s)`, accent: 'accent-amber', iconBg: 'var(--amber-bg)', icon: Wrench, iconColor: 'var(--amber)', subClass: atrasadas.length > 0 ? 'metric-sub-down' : '' },
          { label: 'Total acumulado', value: formatCurrency(totalGeral), sub: `${despesas?.length ?? 0} registros`, accent: 'accent-violet', iconBg: 'var(--violet-bg)', icon: Sparkles, iconColor: 'var(--violet)' },
        ].map(m => (
          <div key={m.label} className={`metric-card ${m.accent}`}>
            <div className="metric-icon" style={{ background: m.iconBg }}>
              <m.icon size={18} style={{ color: m.iconColor }} />
            </div>
            <p className="metric-label">{m.label}</p>
            <p className="metric-value">{m.value}</p>
            <p className={`metric-sub ${m.subClass ?? ''}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {(!veiculos || veiculos.length === 0) && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <Car size={26} style={{ color: 'var(--ink-4)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.4px' }}>
              Adicione seu primeiro veículo
            </h3>
            <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
              Cadastre seu carro para começar a rastrear manutenções e despesas.
            </p>
            <Link href="/dashboard/veiculos/novo" className="btn btn-primary mt-3">
              <Car size={14} /> Cadastrar veículo
            </Link>
          </div>
        </div>
      )}

      {/* Grid principal */}
      {veiculos && veiculos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Manutenções — 3 cols */}
          <div className="card lg:col-span-3">
            <div className="card-header">
              <span className="card-title">Próximas manutenções</span>
              <Link href="/dashboard/manutencoes" className="card-link flex items-center gap-1">
                Ver todas <ArrowRight size={11} />
              </Link>
            </div>

            {pendentes.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 24px' }}>
                <Wrench size={22} style={{ color: 'var(--ink-4)' }} />
                <p className="text-sm" style={{ color: 'var(--ink-4)' }}>Nenhuma manutenção pendente</p>
              </div>
            ) : (
              <>
                {pendentes.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-5 py-3"
                    style={{ borderBottom: '1.5px solid var(--bdr)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: m.status === 'atrasada' ? 'var(--rose)' : 'var(--amber)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)', fontWeight: 600 }}>{m.tipo}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>
                        {m.data_prevista ? new Date(m.data_prevista + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem data'}
                        {m.custo ? ` · ${formatCurrency(Number(m.custo))}` : ''}
                      </p>
                    </div>
                    <span className={`badge ${m.status === 'atrasada' ? 'badge-rose' : 'badge-amber'}`}>
                      {m.status}
                    </span>
                  </div>
                ))}

                {pendentes[0] && (
                  <div className="alert alert-amber m-4">
                    <Info size={14} style={{ fill: 'var(--amber)' }} />
                    <span>
                      {pendentes[0].tipo} prevista para{' '}
                      {pendentes[0].data_prevista
                        ? new Date(pendentes[0].data_prevista + 'T00:00:00').toLocaleDateString('pt-BR')
                        : 'em breve'}
                      {pendentes[0].custo ? ` — reserve ${formatCurrency(Number(pendentes[0].custo))}` : ''}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Lateral — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Meus veículos</span>
                <Link href="/dashboard/veiculos" className="card-link flex items-center gap-1">
                  Ver todos <ArrowRight size={11} />
                </Link>
              </div>
              {veiculos.map(v => (
                <Link key={v.id} href={`/dashboard/veiculos/${v.id}`}>
                  <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--surf-2)] cursor-pointer"
                    style={{ borderBottom: '1.5px solid var(--bdr)' }}>
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--brand-bg)' }}>
                      <Car size={17} style={{ color: 'var(--brand)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: 'var(--ink)', fontWeight: 700 }}>{v.apelido}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--ink-4)' }}>{v.marca} {v.modelo} · {v.ano}</p>
                    </div>
                    <p className="text-xs font-semibold flex-shrink-0 mono" style={{ color: 'var(--ink-3)' }}>
                      {formatKm(v.quilometragem)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Últimos gastos</span>
                <Link href="/dashboard/despesas" className="card-link flex items-center gap-1">
                  Ver todos <ArrowRight size={11} />
                </Link>
              </div>
              {(despesas ?? []).length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: 'var(--ink-4)' }}>Nenhuma despesa registrada</p>
              ) : (
                (despesas ?? []).slice(0, 3).map((d, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3"
                    style={{ borderBottom: i < 2 ? '1.5px solid var(--bdr)' : 'none' }}>
                    <p className="text-sm capitalize" style={{ color: 'var(--ink-2)' }}>{d.categoria}</p>
                    <p className="text-sm font-bold mono" style={{ color: 'var(--ink)' }}>
                      {formatCurrency(Number(d.valor))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
