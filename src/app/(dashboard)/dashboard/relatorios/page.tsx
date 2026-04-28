'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { formatCurrency, categoriasLabel } from '@/lib/utils'
import {
  BarChart3, PieChart, TrendingUp,
  Download, FileText, Filter,
  Car, Calendar,
} from 'lucide-react'
import type { Veiculo, CategoriasDespesa } from '@/types'

type Despesa = {
  id: string
  valor: number
  data: string
  categoria: CategoriasDespesa
  descricao: string | null
  veiculo_id: string
  veiculos?: { apelido: string }
}

type DadosMes = { mes: string; total: number; label: string }
type DadosCategoria = { categoria: string; total: number; percentual: number; cor: string }
type DadosVeiculo = { apelido: string; total: number; km: number; custoPorKm: number }

const coresCategoria: Record<string, string> = {
  combustivel: '#d97706',
  manutencao:  '#1a56db',
  seguro:      '#7c3aed',
  multa:       '#e11d48',
  ipva:        '#059669',
  outros:      '#6b7280',
}

export default function RelatoriosPage() {
  const supabase = createClient()
  const [despesas,  setDespesas]  = useState<Despesa[]>([])
  const [veiculos,  setVeiculos]  = useState<Veiculo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [aba,       setAba]       = useState<'mensal' | 'categoria' | 'veiculo'>('mensal')
  const [filtroVeiculo, setFiltroVeiculo] = useState('todos')
  const [filtroAno,     setFiltroAno]     = useState(String(new Date().getFullYear()))

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: d }, { data: v }] = await Promise.all([
        supabase.from('despesas').select('*, veiculos(apelido)').eq('user_id', user.id).order('data'),
        supabase.from('veiculos').select('*').eq('user_id', user.id),
      ])
      setDespesas((d ?? []) as Despesa[])
      setVeiculos(v ?? [])
      setCarregando(false)
    }
    carregar()
  }, [])

  // ── Filtros ────────────────────────────────────────────────
  const despesasFiltradas = despesas.filter(d => {
    const ano = d.data.substring(0, 4)
    const veiculoOk = filtroVeiculo === 'todos' || d.veiculo_id === filtroVeiculo
    return ano === filtroAno && veiculoOk
  })

  const totalFiltrado = despesasFiltradas.reduce((s, d) => s + Number(d.valor), 0)

  // ── Dados por mês ──────────────────────────────────────────
  const dadosMensais: DadosMes[] = Array.from({ length: 12 }, (_, i) => {
    const mes    = String(i + 1).padStart(2, '0')
    const chave  = `${filtroAno}-${mes}`
    const total  = despesasFiltradas
      .filter(d => d.data.startsWith(chave))
      .reduce((s, d) => s + Number(d.valor), 0)
    const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    return { mes: chave, total, label: labels[i] }
  })
  const maxMensal = Math.max(...dadosMensais.map(d => d.total), 1)

  // ── Dados por categoria ────────────────────────────────────
  const dadosCategoria: DadosCategoria[] = Object.keys(categoriasLabel).map(cat => {
    const total = despesasFiltradas
      .filter(d => d.categoria === cat)
      .reduce((s, d) => s + Number(d.valor), 0)
    return {
      categoria:  cat,
      total,
      percentual: totalFiltrado > 0 ? (total / totalFiltrado) * 100 : 0,
      cor:        coresCategoria[cat] || '#6b7280',
    }
  }).filter(d => d.total > 0).sort((a, b) => b.total - a.total)

  // ── Dados por veículo ──────────────────────────────────────
  const dadosVeiculo: DadosVeiculo[] = veiculos.map(v => {
    const total = despesasFiltradas
      .filter(d => d.veiculo_id === v.id)
      .reduce((s, d) => s + Number(d.valor), 0)
    const custoPorKm = v.quilometragem > 0 ? total / v.quilometragem : 0
    return { apelido: v.apelido, total, km: v.quilometragem, custoPorKm }
  }).sort((a, b) => b.total - a.total)

  // ── Gráfico de pizza SVG ───────────────────────────────────
  function PieChartSVG() {
    if (dadosCategoria.length === 0) return (
      <div className="empty-state" style={{ padding: 40 }}>
        <p className="text-sm" style={{ color: 'var(--ink-4)' }}>Sem dados para exibir</p>
      </div>
    )
    let angulo = 0
    const r = 80, cx = 100, cy = 100
    const segmentos = dadosCategoria.map(d => {
      const graus   = (d.percentual / 100) * 360
      const inicio  = angulo
      angulo += graus
      const rad1 = (inicio - 90) * (Math.PI / 180)
      const rad2 = (angulo - 90) * (Math.PI / 180)
      const x1 = cx + r * Math.cos(rad1)
      const y1 = cy + r * Math.sin(rad1)
      const x2 = cx + r * Math.cos(rad2)
      const y2 = cy + r * Math.sin(rad2)
      const grande = graus > 180 ? 1 : 0
      return { ...d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${grande} 1 ${x2} ${y2} Z` }
    })
    return (
      <div className="flex items-center gap-6 flex-wrap">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {segmentos.map((s, i) => (
            <path key={i} d={s.path} fill={s.cor} stroke="white" strokeWidth="2" />
          ))}
          <circle cx={cx} cy={cy} r={40} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
            Total
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="var(--ink-3)">
            {formatCurrency(totalFiltrado).replace('R$\u00a0', 'R$ ')}
          </text>
        </svg>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {dadosCategoria.map(d => (
            <div key={d.categoria} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.cor }} />
              <span className="text-xs flex-1 truncate" style={{ color: 'var(--ink-2)' }}>
                {categoriasLabel[d.categoria as CategoriasDespesa]}
              </span>
              <span className="text-xs font-bold mono" style={{ color: 'var(--ink)' }}>
                {d.percentual.toFixed(1)}%
              </span>
              <span className="text-xs font-bold mono" style={{ color: 'var(--ink-3)' }}>
                {formatCurrency(d.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Exportar CSV ───────────────────────────────────────────
  function exportarCSV() {
    const linhas = [
      'data,veiculo,categoria,descricao,valor',
      ...despesasFiltradas.map(d =>
        `${d.data},${(d as any).veiculos?.apelido ?? ''},${d.categoria},"${d.descricao ?? ''}",${Number(d.valor).toFixed(2)}`
      ),
    ]
    const blob = new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `autogest-relatorio-${filtroAno}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Exportar PDF via print ─────────────────────────────────
  function exportarPDF() {
    window.print()
  }

  const anos = Array.from(
    new Set(despesas.map(d => d.data.substring(0, 4)))
  ).sort().reverse()
  if (!anos.includes(String(new Date().getFullYear()))) {
    anos.unshift(String(new Date().getFullYear()))
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3" style={{ color: 'var(--ink-4)' }}>
          <BarChart3 size={20} className="animate-pulse" />
          <span className="text-sm">Carregando relatórios...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl flex flex-col gap-5">

      {/* Filtros e exportação */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--brand-bg)' }}>
              <Filter size={14} style={{ color: 'var(--brand)' }} />
            </div>
            <p className="card-title">Filtros</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportarCSV} className="btn btn-sm flex items-center gap-1.5">
              <Download size={12} /> CSV
            </button>
            <button onClick={exportarPDF} className="btn btn-sm flex items-center gap-1.5">
              <FileText size={12} /> PDF
            </button>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: 'var(--ink-3)' }} />
            <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)}
              style={{ width: 'auto', padding: '6px 32px 6px 10px', fontSize: 13 }}>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Car size={14} style={{ color: 'var(--ink-3)' }} />
            <select value={filtroVeiculo} onChange={e => setFiltroVeiculo(e.target.value)}
              style={{ width: 'auto', padding: '6px 32px 6px 10px', fontSize: 13 }}>
              <option value="todos">Todos os veículos</option>
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
            </select>
          </div>
          <div className="ml-auto">
            <span className="text-sm font-bold mono" style={{ color: 'var(--ink)' }}>
              Total: {formatCurrency(totalFiltrado)}
            </span>
            <span className="text-xs ml-2" style={{ color: 'var(--ink-4)' }}>
              ({despesasFiltradas.length} registros)
            </span>
          </div>
        </div>
      </div>

      {/* Resumo métricas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="metric-card accent-brand">
          <div className="metric-icon" style={{ background: 'var(--brand-bg)' }}>
            <BarChart3 size={17} style={{ color: 'var(--brand)' }} />
          </div>
          <p className="metric-label">Total {filtroAno}</p>
          <p className="metric-value">{formatCurrency(totalFiltrado)}</p>
          <p className="metric-sub">{despesasFiltradas.length} registros</p>
        </div>
        <div className="metric-card accent-amber">
          <div className="metric-icon" style={{ background: 'var(--amber-bg)' }}>
            <TrendingUp size={17} style={{ color: 'var(--amber)' }} />
          </div>
          <p className="metric-label">Média mensal</p>
          <p className="metric-value">
            {formatCurrency(totalFiltrado / 12)}
          </p>
          <p className="metric-sub">por mês em {filtroAno}</p>
        </div>
        <div className="metric-card accent-violet">
          <div className="metric-icon" style={{ background: 'var(--violet-bg)' }}>
            <PieChart size={17} style={{ color: 'var(--violet)' }} />
          </div>
          <p className="metric-label">Maior gasto</p>
          <p className="metric-value" style={{ fontSize: '1rem' }}>
            {dadosCategoria[0]
              ? categoriasLabel[dadosCategoria[0].categoria as CategoriasDespesa]
              : '—'}
          </p>
          <p className="metric-sub">
            {dadosCategoria[0] ? formatCurrency(dadosCategoria[0].total) : '—'}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="card">
        <div className="tabs">
          {[
            { id: 'mensal',    label: 'Gastos por mês',      icon: BarChart3 },
            { id: 'categoria', label: 'Por categoria',        icon: PieChart },
            { id: 'veiculo',   label: 'Por veículo',          icon: Car },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setAba(t.id as typeof aba)}
              className={`tab ${aba === t.id ? 'active' : ''}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Gráfico mensal ── */}
          {aba === 'mensal' && (
            <div>
              <div className="flex items-end gap-1.5" style={{ height: 200 }}>
                {dadosMensais.map(m => {
                  const h = maxMensal > 0 ? (m.total / maxMensal) * 170 : 0
                  const mesAtual = new Date().toISOString().substring(0, 7)
                  const isAtual  = m.mes === mesAtual
                  return (
                    <div key={m.mes} className="flex flex-col items-center gap-1 flex-1">
                      {m.total > 0 && (
                        <span className="text-xs font-bold mono" style={{ color: 'var(--ink-3)', fontSize: 9 }}>
                          {formatCurrency(m.total).replace('R$\u00a0', '')}
                        </span>
                      )}
                      <div
                        title={`${m.label}: ${formatCurrency(m.total)}`}
                        style={{
                          width: '100%',
                          height: Math.max(h, m.total > 0 ? 4 : 0),
                          background: isAtual ? 'var(--brand)' : 'var(--brand-bd)',
                          borderRadius: '5px 5px 0 0',
                          transition: 'height .3s',
                          cursor: 'pointer',
                          minHeight: m.total > 0 ? 4 : 0,
                        }}
                      />
                      <span className="text-xs font-medium" style={{ color: isAtual ? 'var(--brand)' : 'var(--ink-4)', fontSize: 10 }}>
                        {m.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              {despesasFiltradas.length === 0 && (
                <p className="text-center text-sm py-4" style={{ color: 'var(--ink-4)' }}>
                  Nenhuma despesa em {filtroAno}
                </p>
              )}
            </div>
          )}

          {/* ── Gráfico categoria ── */}
          {aba === 'categoria' && <PieChartSVG />}

          {/* ── Gráfico veículo ── */}
          {aba === 'veiculo' && (
            <div className="flex flex-col gap-4">
              {dadosVeiculo.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--ink-4)' }}>
                  Nenhum dado disponível
                </p>
              ) : (
                dadosVeiculo.map(v => {
                  const maxTotal = Math.max(...dadosVeiculo.map(x => x.total), 1)
                  const pct = (v.total / maxTotal) * 100
                  return (
                    <div key={v.apelido}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                          {v.apelido}
                        </span>
                        <div className="flex items-center gap-3">
                          {v.custoPorKm > 0 && (
                            <span className="text-xs" style={{ color: 'var(--ink-4)' }}>
                              R$ {v.custoPorKm.toFixed(2)}/km
                            </span>
                          )}
                          <span className="text-sm font-bold mono" style={{ color: 'var(--ink)' }}>
                            {formatCurrency(v.total)}
                          </span>
                        </div>
                      </div>
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{ width: `${pct}%`, background: 'var(--brand)' }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabela de despesas */}
      <div className="card">
        <div className="card-header">
          <p className="card-title">Detalhamento</p>
          <span className="text-xs" style={{ color: 'var(--ink-4)' }}>
            {despesasFiltradas.length} registros
          </span>
        </div>
        {despesasFiltradas.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <p className="text-sm" style={{ color: 'var(--ink-4)' }}>
              Nenhuma despesa encontrada para os filtros selecionados
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Veículo</th>
                <th>Categoria</th>
                <th>Data</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesasFiltradas.slice().reverse().map(d => (
                <tr key={d.id}>
                  <td className="font-semibold" style={{ color: 'var(--ink)' }}>
                    {d.descricao || categoriasLabel[d.categoria]}
                  </td>
                  <td style={{ color: 'var(--ink-3)' }}>
                    {(d as any).veiculos?.apelido ?? '—'}
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: coresCategoria[d.categoria] + '20',
                      color: coresCategoria[d.categoria],
                      border: `1px solid ${coresCategoria[d.categoria]}40`,
                    }}>
                      {categoriasLabel[d.categoria]}
                    </span>
                  </td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>
                    {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="mono font-bold" style={{ textAlign: 'right', color: 'var(--ink)' }}>
                    {formatCurrency(Number(d.valor))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
