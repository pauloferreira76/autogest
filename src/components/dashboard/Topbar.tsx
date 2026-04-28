'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Plus, Wrench, DollarSign, Sparkles, X, CheckCheck } from 'lucide-react'
import { getSaudacao } from '@/lib/utils'

const pages: Record<string, { title: string; sub: string }> = {
  '/dashboard':               { title: 'Dashboard',       sub: 'Resumo geral dos seus veículos'    },
  '/dashboard/veiculos':      { title: 'Meus veículos',   sub: 'Gerencie sua frota pessoal'        },
  '/dashboard/manutencoes':   { title: 'Manutenções',     sub: 'Revisões e serviços agendados'     },
  '/dashboard/despesas':      { title: 'Despesas',        sub: 'Controle financeiro dos veículos'  },
  '/dashboard/ia':            { title: 'Assistente IA',   sub: 'Análise inteligente dos seus dados'},
  '/dashboard/configuracoes': { title: 'Configurações',   sub: 'Perfil e preferências da conta'   },
}

const ctas: Record<string, { label: string; href: string }> = {
  '/dashboard':             { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/veiculos':    { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/despesas':    { label: 'Nova despesa',       href: '/dashboard/despesas/nova'    },
  '/dashboard/manutencoes': { label: 'Agendar manutenção', href: '/dashboard/manutencoes/nova' },
}

type Notif = {
  id: string
  tipo: 'manutencao' | 'despesa' | 'ia'
  titulo: string
  descricao: string
  tempo: string
  lida: boolean
}

const notificacoesIniciais: Notif[] = [
  {
    id: '1',
    tipo: 'manutencao',
    titulo: 'Manutenção próxima do vencimento',
    descricao: 'Troca de pneus do Onix Plus vence em 5 dias (29/04/2026).',
    tempo: 'Agora',
    lida: false,
  },
  {
    id: '2',
    tipo: 'ia',
    titulo: 'Novo insight do Assistente IA',
    descricao: 'Seu custo por km está abaixo da média nacional. Veja a análise completa.',
    tempo: 'há 2 horas',
    lida: false,
  },
  {
    id: '3',
    tipo: 'despesa',
    titulo: 'Resumo de gastos de abril',
    descricao: 'Você gastou R$ 100,00 em abril. Veja o detalhamento por categoria.',
    tempo: 'há 1 dia',
    lida: true,
  },
]

const iconeTipo = {
  manutencao: { icon: Wrench,     bg: 'var(--amber-bg)',   color: 'var(--amber)' },
  despesa:    { icon: DollarSign, bg: 'var(--emerald-bg)', color: 'var(--emerald)' },
  ia:         { icon: Sparkles,   bg: 'var(--violet-bg)',  color: 'var(--violet)' },
}

type Props = { userName: string }

export default function Topbar({ userName }: Props) {
  const pathname = usePathname()
  const [aberto,   setAberto]   = useState(false)
  const [notifs,   setNotifs]   = useState<Notif[]>(notificacoesIniciais)
  const painelRef = useRef<HTMLDivElement>(null)

  const page = pages[pathname] ?? { title: 'AutoGest', sub: '' }
  const cta  = ctas[pathname]
  const nome = userName?.split(' ')[0] || 'usuário'
  const naoLidas = notifs.filter(n => !n.lida).length

  // Fecha o painel ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    if (aberto) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [aberto])

  function marcarTodasLidas() {
    setNotifs(prev => prev.map(n => ({ ...n, lida: true })))
  }

  function marcarLida(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  }

  function remover(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">
          {pathname === '/dashboard' ? `${getSaudacao()}, ${nome} 👋` : page.title}
        </h1>
        <p className="topbar-sub">{page.sub}</p>
      </div>

      <div className="flex items-center gap-2.5">
        {cta && (
          <Link href={cta.href} className="btn btn-primary btn-sm flex items-center gap-1.5">
            <Plus size={13} />
            {cta.label}
          </Link>
        )}

        {/* Botão sino + painel */}
        <div style={{ position: 'relative' }} ref={painelRef}>
          <button
            className="notif-btn"
            onClick={() => setAberto(!aberto)}
            title="Notificações"
          >
            <Bell size={16} style={{ color: aberto ? 'var(--brand)' : 'var(--ink-4)' }} />
            {naoLidas > 0 && <span className="notif-dot" />}
          </button>

          {/* Painel de notificações */}
          {aberto && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 340,
              background: 'var(--surf)',
              border: '1.5px solid var(--bdr)',
              borderRadius: 'var(--r-lg)',
              boxShadow: '0 8px 32px rgba(0,0,0,.12)',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              {/* Header do painel */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1.5px solid var(--bdr)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                    Notificações
                  </span>
                  {naoLidas > 0 && (
                    <span className="badge badge-brand">{naoLidas} novas</span>
                  )}
                </div>
                {naoLidas > 0 && (
                  <button
                    onClick={marcarTodasLidas}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 11, fontWeight: 600, color: 'var(--brand)',
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <CheckCheck size={13} />
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              {/* Lista */}
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifs.length === 0 ? (
                  <div style={{
                    padding: '40px 24px', textAlign: 'center',
                    fontSize: 13, color: 'var(--ink-4)',
                  }}>
                    Nenhuma notificação
                  </div>
                ) : (
                  notifs.map(n => {
                    const t = iconeTipo[n.tipo]
                    const Icon = t.icon
                    return (
                      <div
                        key={n.id}
                        onClick={() => marcarLida(n.id)}
                        style={{
                          display: 'flex',
                          gap: 12,
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--bdr)',
                          background: n.lida ? 'var(--surf)' : 'var(--brand-bg)',
                          cursor: 'pointer',
                          transition: 'background .1s',
                          position: 'relative',
                        }}
                      >
                        {/* Ícone */}
                        <div style={{
                          width: 34, height: 34,
                          borderRadius: 9,
                          background: t.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={16} style={{ color: t.color }} />
                        </div>

                        {/* Conteúdo */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 12, fontWeight: n.lida ? 500 : 700,
                            color: 'var(--ink)', marginBottom: 3,
                            lineHeight: 1.3,
                          }}>
                            {n.titulo}
                          </p>
                          <p style={{
                            fontSize: 11, color: 'var(--ink-3)',
                            lineHeight: 1.4, marginBottom: 4,
                          }}>
                            {n.descricao}
                          </p>
                          <p style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600 }}>
                            {n.tempo}
                          </p>
                        </div>

                        {/* Botão remover */}
                        <button
                          onClick={e => { e.stopPropagation(); remover(n.id) }}
                          style={{
                            position: 'absolute', top: 10, right: 10,
                            width: 20, height: 20,
                            borderRadius: 6,
                            background: 'none', border: 'none',
                            cursor: 'pointer', color: 'var(--ink-4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={12} />
                        </button>

                        {/* Ponto de não lida */}
                        {!n.lida && (
                          <div style={{
                            position: 'absolute', top: 16, right: 32,
                            width: 6, height: 6,
                            borderRadius: '50%',
                            background: 'var(--brand)',
                          }} />
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '10px 16px',
                borderTop: '1.5px solid var(--bdr)',
                background: 'var(--surf-2)',
              }}>
                <Link
                  href="/dashboard/configuracoes"
                  onClick={() => setAberto(false)}
                  style={{
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--brand)', textDecoration: 'none',
                    display: 'block', textAlign: 'center',
                  }}
                >
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
