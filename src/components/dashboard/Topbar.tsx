'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Plus, Wrench, DollarSign, Sparkles, X, CheckCheck, Menu } from 'lucide-react'
import { getSaudacao } from '@/lib/utils'

const pages: Record<string, { title: string; sub: string }> = {
  '/dashboard':                { title: 'Dashboard',       sub: 'Resumo geral dos seus veículos'    },
  '/dashboard/veiculos':       { title: 'Meus veículos',   sub: 'Gerencie sua frota pessoal'        },
  '/dashboard/manutencoes':    { title: 'Manutenções',     sub: 'Revisões e serviços agendados'     },
  '/dashboard/despesas':       { title: 'Despesas',        sub: 'Controle financeiro dos veículos'  },
  '/dashboard/relatorios':     { title: 'Relatórios',      sub: 'Análise de gastos e gráficos'      },
  '/dashboard/ia':             { title: 'Assistente IA',   sub: 'Análise inteligente dos seus dados'},
  '/dashboard/configuracoes':  { title: 'Configurações',   sub: 'Perfil e preferências da conta'   },
}

const ctas: Record<string, { label: string; href: string }> = {
  '/dashboard':             { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/veiculos':    { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/despesas':    { label: 'Nova despesa',       href: '/dashboard/despesas/nova'    },
  '/dashboard/manutencoes': { label: 'Agendar',            href: '/dashboard/manutencoes/nova' },
}

type Notif = { id: string; tipo: 'manutencao'|'despesa'|'ia'; titulo: string; descricao: string; tempo: string; lida: boolean }

const notifIniciais: Notif[] = [
  { id:'1', tipo:'manutencao', titulo:'Manutenção próxima', descricao:'Troca de pneus vence em 5 dias.', tempo:'Agora', lida:false },
  { id:'2', tipo:'ia',         titulo:'Insight da IA',       descricao:'Custo por km abaixo da média nacional.', tempo:'há 2h', lida:false },
  { id:'3', tipo:'despesa',    titulo:'Resumo de abril',     descricao:'R$ 100,00 gastos em abril.', tempo:'há 1d', lida:true },
]

const iconeTipo = {
  manutencao: { icon: Wrench,     bg:'var(--amber-bg)',   color:'var(--amber)'   },
  despesa:    { icon: DollarSign, bg:'var(--emerald-bg)', color:'var(--emerald)' },
  ia:         { icon: Sparkles,   bg:'var(--violet-bg)',  color:'var(--violet)'  },
}

type Props = { userName: string; onMenuClick: () => void }

export default function Topbar({ userName, onMenuClick }: Props) {
  const pathname = usePathname()
  const [aberto, setAberto] = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>(notifIniciais)
  const painelRef = useRef<HTMLDivElement>(null)

  const page     = pages[pathname] ?? { title: 'AutoGest', sub: '' }
  const cta      = ctas[pathname]
  const nome     = userName?.split(' ')[0] || 'usuário'
  const naoLidas = notifs.filter(n => !n.lida).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    if (aberto) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [aberto])

  return (
    <header className="topbar">
      <div className="flex items-center gap-3 min-w-0">
        {/* Botão hamburguer — só aparece no mobile/tablet */}
        <button
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu size={18} style={{ color: 'var(--ink-3)' }} />
        </button>

        <div className="min-w-0">
          <h1 className="topbar-title truncate">
            {pathname === '/dashboard' ? `${getSaudacao()}, ${nome} 👋` : page.title}
          </h1>
          <p className="topbar-sub">{page.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {cta && (
          <Link href={cta.href}
            className="btn btn-primary btn-sm flex items-center gap-1.5"
            style={{ minHeight: 36 }}>
            <Plus size={13} />
            <span className="hidden sm:inline">{cta.label}</span>
            <span className="sm:hidden">Novo</span>
          </Link>
        )}

        {/* Notificações */}
        <div style={{ position: 'relative' }} ref={painelRef}>
          <button
            className="notif-btn"
            onClick={() => setAberto(!aberto)}
            aria-label="Notificações"
          >
            <Bell size={17} style={{ color: aberto ? 'var(--brand)' : 'var(--ink-4)' }} />
            {naoLidas > 0 && <span className="notif-dot" />}
          </button>

          {aberto && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 'min(340px, calc(100vw - 28px))',
              background: 'var(--surf)',
              border: '1.5px solid var(--bdr)',
              borderRadius: 'var(--r-lg)',
              boxShadow: '0 8px 32px rgba(0,0,0,.12)',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1.5px solid var(--bdr)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>Notificações</span>
                  {naoLidas > 0 && <span className="badge badge-brand">{naoLidas} novas</span>}
                </div>
                {naoLidas > 0 && (
                  <button onClick={() => setNotifs(p => p.map(n => ({...n,lida:true})))}
                    style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'var(--brand)', background:'none', border:'none', cursor:'pointer' }}>
                    <CheckCheck size={13} /> Marcar lidas
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 320, overflowY:'auto' }}>
                {notifs.length === 0 ? (
                  <div style={{ padding:'32px 24px', textAlign:'center', fontSize:13, color:'var(--ink-4)' }}>
                    Nenhuma notificação
                  </div>
                ) : notifs.map(n => {
                  const t = iconeTipo[n.tipo]; const Icon = t.icon
                  return (
                    <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id===n.id?{...x,lida:true}:x))}
                      style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom:'1px solid var(--bdr)', background:n.lida?'var(--surf)':'var(--brand-bg)', cursor:'pointer', position:'relative' }}>
                      <div style={{ width:32, height:32, borderRadius:9, background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={15} style={{ color:t.color }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:12, fontWeight:n.lida?500:700, color:'var(--ink)', marginBottom:2, lineHeight:1.3 }}>{n.titulo}</p>
                        <p style={{ fontSize:11, color:'var(--ink-3)', lineHeight:1.4, marginBottom:3 }}>{n.descricao}</p>
                        <p style={{ fontSize:10, color:'var(--ink-4)', fontWeight:600 }}>{n.tempo}</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setNotifs(p => p.filter(x => x.id!==n.id)) }}
                        style={{ position:'absolute', top:10, right:10, width:20, height:20, borderRadius:6, background:'none', border:'none', cursor:'pointer', color:'var(--ink-4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <X size={11} />
                      </button>
                      {!n.lida && <div style={{ position:'absolute', top:14, right:30, width:6, height:6, borderRadius:'50%', background:'var(--brand)' }} />}
                    </div>
                  )
                })}
              </div>

              <div style={{ padding:'10px 16px', borderTop:'1.5px solid var(--bdr)', background:'var(--surf-2)' }}>
                <Link href="/dashboard/configuracoes" onClick={() => setAberto(false)}
                  style={{ fontSize:12, fontWeight:600, color:'var(--brand)', textDecoration:'none', display:'block', textAlign:'center' }}>
                  Gerenciar notificações →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
