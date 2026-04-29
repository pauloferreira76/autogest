'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Car, Wrench, DollarSign,
  Sparkles, Settings, LogOut, BarChart3,
  Menu, X, Bell, Plus
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getInitials, getSaudacao } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',             icon: LayoutDashboard, group: 'main'  },
  { label: 'Veículos',      href: '/dashboard/veiculos',    icon: Car,             group: 'main'  },
  { label: 'Manutenções',   href: '/dashboard/manutencoes', icon: Wrench,          group: 'main'  },
  { label: 'Despesas',      href: '/dashboard/despesas',    icon: DollarSign,      group: 'fin'   },
  { label: 'Relatórios',    href: '/dashboard/relatorios',  icon: BarChart3,       group: 'fin'   },
  { label: 'IA',            href: '/dashboard/ia',          icon: Sparkles,        group: 'fin', isPro: true },
]

const bottomNavItems = [
  { label: 'Início',        href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Veículos',      href: '/dashboard/veiculos',    icon: Car             },
  { label: 'Manutenções',   href: '/dashboard/manutencoes', icon: Wrench          },
  { label: 'Despesas',      href: '/dashboard/despesas',    icon: DollarSign      },
  { label: 'Mais',          href: '/dashboard/configuracoes', icon: Settings      },
]

const pagesMeta: Record<string, { title: string; sub: string }> = {
  '/dashboard':                { title: 'Dashboard',     sub: 'Resumo geral dos seus veículos'    },
  '/dashboard/veiculos':       { title: 'Veículos',      sub: 'Gerencie sua frota pessoal'        },
  '/dashboard/manutencoes':    { title: 'Manutenções',   sub: 'Revisões e serviços agendados'     },
  '/dashboard/despesas':       { title: 'Despesas',      sub: 'Controle financeiro'               },
  '/dashboard/relatorios':     { title: 'Relatórios',    sub: 'Análise de gastos e gráficos'      },
  '/dashboard/ia':             { title: 'Assistente IA', sub: 'Análise inteligente dos seus dados'},
  '/dashboard/configuracoes':  { title: 'Configurações', sub: 'Perfil e preferências da conta'   },
}

const ctaMap: Record<string, { label: string; href: string }> = {
  '/dashboard':             { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/veiculos':    { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/despesas':    { label: 'Nova despesa',       href: '/dashboard/despesas/nova'    },
  '/dashboard/manutencoes': { label: 'Agendar',            href: '/dashboard/manutencoes/nova' },
}

type Props = { userName: string; userEmail: string; children: React.ReactNode }

export default function DashboardLayout({ userName, userEmail, children }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(userName, userEmail)
  const page     = pagesMeta[pathname] ?? { title: 'AutoGest', sub: '' }
  const cta      = ctaMap[pathname]
  const nome     = userName?.split(' ')[0] || 'usuário'

  // Fecha notif ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  // Fecha sidebar ao navegar
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  // Bloqueia scroll do body quando sidebar aberta
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <>
      {/* Logo + fechar no mobile */}
      <div className="sidebar-logo" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="sidebar-logo-icon">
            <Car size={18} style={{ color: '#fff' }} />
          </div>
          <span className="sidebar-logo-name">AutoGest</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.4)', padding: 4 }}
          className="sidebar-close-btn">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
        <p className="sidebar-section">Principal</p>
        <div className="sidebar-nav">
          {navItems.filter(i => i.group === 'main').map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}>
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </div>

        <p className="sidebar-section" style={{ marginTop: 8 }}>Finanças & IA</p>
        <div className="sidebar-nav">
          {navItems.filter(i => i.group === 'fin').map(item => {
            const active = isActive(item.href)
            const isIA = item.isPro
            return (
              <Link key={item.href} href={item.href}
                className={`sidebar-item ${active ? (isIA ? 'active-violet' : 'active') : ''}`}>
                <item.icon size={15} />
                {item.label}
                {isIA && !active && <span className="sidebar-pro-badge">Pro</span>}
              </Link>
            )
          })}
        </div>

        <p className="sidebar-section" style={{ marginTop: 8 }}>Conta</p>
        <div className="sidebar-nav">
          <Link href="/dashboard/configuracoes"
            className={`sidebar-item ${isActive('/dashboard/configuracoes') ? 'active' : ''}`}>
            <Settings size={15} />
            Configurações
          </Link>
        </div>
      </nav>

      {/* Usuário */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName || 'Usuário'}
            </p>
            <p className="sidebar-user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </p>
          </div>
          <button onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, color: 'rgba(255,255,255,.35)', flexShrink: 0 }}
            title="Sair">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="app-shell">

      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            {/* Hamburger — só no mobile */}
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} style={{ color: 'var(--ink-3)' }} />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 className="topbar-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pathname === '/dashboard' ? `${getSaudacao()}, ${nome} 👋` : page.title}
              </h1>
              <p className="topbar-sub">{page.sub}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {cta && (
              <Link href={cta.href} className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={13} />
                <span className="hide-mobile">{cta.label}</span>
                <span style={{ display: 'none' }} className="show-mobile-only">Novo</span>
              </Link>
            )}

            {/* Notificações */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={16} style={{ color: notifOpen ? 'var(--brand)' : 'var(--ink-4)' }} />
                <span className="notif-dot" />
              </button>
              {notifOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 'min(340px, calc(100vw - 28px))',
                  background: 'var(--surf)', border: '1.5px solid var(--bdr)',
                  borderRadius: 'var(--r-lg)', boxShadow: '0 8px 32px rgba(0,0,0,.12)',
                  zIndex: 1000, overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1.5px solid var(--bdr)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Notificações</span>
                      <span className="badge badge-brand">2 novas</span>
                    </div>
                    <button style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Marcar lidas
                    </button>
                  </div>
                  {[
                    { icon: Wrench, bg: 'var(--amber-bg)', color: 'var(--amber)', title: 'Manutenção próxima do vencimento', desc: 'Troca de pneus vence em 5 dias', time: 'Agora', unread: true },
                    { icon: Sparkles, bg: 'var(--violet-bg)', color: 'var(--violet)', title: 'Novo insight do Assistente IA', desc: 'Seu custo por km está abaixo da média nacional', time: 'há 2h', unread: true },
                    { icon: DollarSign, bg: 'var(--emerald-bg)', color: 'var(--emerald)', title: 'Resumo de gastos de abril', desc: 'Você gastou R$ 100 em abril', time: 'há 1 dia', unread: false },
                  ].map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 15px', borderBottom: '1px solid var(--bdr)', background: n.unread ? 'var(--brand-bg)' : 'var(--surf)', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <n.icon size={15} style={{ color: n.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: n.unread ? 700 : 500, color: 'var(--ink)', marginBottom: 2, lineHeight: 1.3 }}>{n.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.4, marginBottom: 3 }}>{n.desc}</p>
                        <p style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600 }}>{n.time}</p>
                      </div>
                      {n.unread && <div style={{ position: 'absolute', top: 14, right: 14, width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)' }} />}
                    </div>
                  ))}
                  <div style={{ padding: '10px 16px', borderTop: '1.5px solid var(--bdr)', background: 'var(--surf-2)' }}>
                    <Link href="/dashboard/configuracoes" onClick={() => setNotifOpen(false)}
                      style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                      Gerenciar notificações →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="page-content">
          {children}
        </main>

        {/* Bottom Navigation (mobile/tablet) */}
        <nav className="bottom-nav">
          {bottomNavItems.map(item => {
            const active = isActive(item.href)
            const isIA = item.href.includes('/ia')
            return (
              <Link key={item.href} href={item.href}
                className={`bottom-nav-item ${active ? (isIA ? 'active-violet' : 'active') : ''}`}>
                <item.icon size={20} />
                <span>{item.label}</span>
                {active && <div className="bottom-nav-dot" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close-btn { display: flex !important; }
          .show-mobile-only { display: inline !important; }
          .hide-mobile-label { display: none; }
        }
        @media (min-width: 769px) {
          .show-mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  )
}
