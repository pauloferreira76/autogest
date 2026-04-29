import { createClient } from '@/lib/supabase-server'
import { formatCurrency, formatDate, categoriasLabel, categoriasCor } from '@/lib/utils'
import { DollarSign, Plus, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import Link from 'next/link'

const categoriaIcone: Record<string, string> = {
  combustivel: '⛽', manutencao: '🔧', seguro: '🛡️',
  multa: '🚨', ipva: '📋', outros: '📦',
}

export default async function DespesasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: despesas } = await supabase
    .from('despesas').select('*, veiculos(apelido)')
    .eq('user_id', user!.id).order('data', { ascending: false })

  const total = (despesas ?? []).reduce((acc, d) => acc + Number(d.valor), 0)
  const media = despesas?.length ? total / despesas.length : 0
  const agora = new Date()
  const inicioMes = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-01`
  const gastoMes = (despesas ?? []).filter(d => d.data >= inicioMes).reduce((acc, d) => acc + Number(d.valor), 0)
  const porCategoria = (despesas ?? []).reduce((acc: Record<string, number>, d) => {
    acc[d.categoria] = (acc[d.categoria] || 0) + Number(d.valor); return acc
  }, {})
  const topCategoria = Object.entries(porCategoria).sort((a, b) => b[1] - a[1])[0]

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="metric-card accent-brand">
          <div className="metric-icon" style={{ background: 'var(--brand-bg)' }}><DollarSign size={18} style={{ color: 'var(--brand)' }} /></div>
          <p className="metric-label">Total acumulado</p>
          <p className="metric-value">{formatCurrency(total)}</p>
          <p className="metric-sub">{despesas?.length ?? 0} registros</p>
        </div>
        <div className="metric-card accent-emerald">
          <div className="metric-icon" style={{ background: 'var(--emerald-bg)' }}><Receipt size={18} style={{ color: 'var(--emerald)' }} /></div>
          <p className="metric-label">Gasto este mês</p>
          <p className="metric-value">{formatCurrency(gastoMes)}</p>
          <p className="metric-sub">{agora.toLocaleString('pt-BR', { month: 'long' })}</p>
        </div>
        <div className="metric-card accent-amber">
          <div className="metric-icon" style={{ background: 'var(--amber-bg)' }}><TrendingUp size={18} style={{ color: 'var(--amber)' }} /></div>
          <p className="metric-label">Média por registro</p>
          <p className="metric-value">{formatCurrency(media)}</p>
          <p className="metric-sub">por lançamento</p>
        </div>
        <div className="metric-card accent-violet">
          <div className="metric-icon" style={{ background: 'var(--violet-bg)' }}><TrendingDown size={18} style={{ color: 'var(--violet)' }} /></div>
          <p className="metric-label">Maior categoria</p>
          <p className="metric-value" style={{ fontSize: '1rem' }}>{topCategoria ? categoriasLabel[topCategoria[0] as keyof typeof categoriasLabel] : '—'}</p>
          <p className="metric-sub">{topCategoria ? formatCurrency(topCategoria[1]) : '—'}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, background: 'var(--brand-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={14} style={{ color: 'var(--brand)' }} />
            </div>
            <p className="card-title">Histórico de despesas</p>
          </div>
          <Link href="/dashboard/despesas/nova" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Plus size={13} /> Nova despesa
          </Link>
        </div>

        {!despesas || despesas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><DollarSign size={26} style={{ color: 'var(--ink-4)' }} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Nenhuma despesa registrada</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Registre seus gastos para ter controle financeiro.</p>
            <Link href="/dashboard/despesas/nova" className="btn btn-primary" style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} /> Registrar despesa
            </Link>
          </div>
        ) : (
          <div>
            {despesas.map((d: any, i: number) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: i < despesas.length - 1 ? '1px solid var(--bdr)' : 'none', transition: 'background .1s' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--surf-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {categoriaIcone[d.categoria] || '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.descricao || categoriasLabel[d.categoria as keyof typeof categoriasLabel]}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{d.veiculos?.apelido} · {formatDate(d.data)}</p>
                </div>
                <span className={`badge hide-mobile ${categoriasCor[d.categoria as keyof typeof categoriasCor] || 'badge-gray'}`}>
                  {categoriasLabel[d.categoria as keyof typeof categoriasLabel]}
                </span>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--mono)', flexShrink: 0, minWidth: 90, textAlign: 'right' }}>
                  {formatCurrency(Number(d.valor))}
                </p>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--surf-2)', borderTop: '1.5px solid var(--bdr)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)' }}>{despesas.length} registro{despesas.length !== 1 ? 's' : ''}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Total:</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
