'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard, Car, Wrench,
  DollarSign, Sparkles, Settings, LogOut, BarChart3, X,
} from 'lucide-react'

const nav = [
  { label: 'Dashboard',     href: '/dashboard',              icon: LayoutDashboard, group: 'main' },
  { label: 'Meus veículos', href: '/dashboard/veiculos',     icon: Car,             group: 'main' },
  { label: 'Manutenções',   href: '/dashboard/manutencoes',  icon: Wrench,          group: 'main' },
  { label: 'Despesas',      href: '/dashboard/despesas',     icon: DollarSign,      group: 'fin'  },
  { label: 'Relatórios',    href: '/dashboard/relatorios',   icon: BarChart3,       group: 'fin'  },
  { label: 'Assistente IA', href: '/dashboard/ia',           icon: Sparkles,        group: 'fin'  },
]

type Props = {
  userName: string
  userEmail: string
  open: boolean
  onClose: () => void
}

export default function Sidebar({ userName, userEmail, open, onClose }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const initials = getInitials(userName, userEmail)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  function handleLink() {
    onClose()
  }

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo + botão fechar no mobile */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Car size={18} className="text-white" />
          </div>
          <span className="sidebar-logo-name">AutoGest</span>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1.5 rounded-lg"
            style={{ color: 'rgba(255,255,255,.4)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <p className="sidebar-section">Principal</p>
          <div className="sidebar-nav">
            {nav.filter(i => i.group === 'main').map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLink}
                className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>

          <p className="sidebar-section mt-2">Finanças & IA</p>
          <div className="sidebar-nav">
            {nav.filter(i => i.group === 'fin').map(item => {
              const active = isActive(item.href)
              const isIA   = item.href.includes('/ia')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLink}
                  className={`sidebar-item ${active ? (isIA ? 'active-violet' : 'active') : ''}`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {isIA && !active && <span className="sidebar-pro-badge">Pro</span>}
                </Link>
              )
            })}
          </div>

          <p className="sidebar-section mt-2">Conta</p>
          <div className="sidebar-nav">
            <Link
              href="/dashboard/configuracoes"
              onClick={handleLink}
              className={`sidebar-item ${pathname.startsWith('/dashboard/configuracoes') ? 'active' : ''}`}
            >
              <Settings size={16} />
              Configurações
            </Link>
          </div>
        </nav>

        {/* Usuário */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="sidebar-user-name truncate">{userName || 'Usuário'}</p>
              <p className="sidebar-user-email truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg transition-colors flex-shrink-0"
              style={{ color: 'rgba(255,255,255,.35)', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
