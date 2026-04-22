'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard, Car, Wrench, DollarSign,
  Sparkles, Settings, LogOut, ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',              icon: LayoutDashboard, section: 'principal' },
  { label: 'Meus veículos', href: '/dashboard/veiculos',     icon: Car,             section: 'principal' },
  { label: 'Manutenções',   href: '/dashboard/manutencoes',  icon: Wrench,          section: 'principal' },
  { label: 'Despesas',      href: '/dashboard/despesas',     icon: DollarSign,      section: 'financas'  },
  { label: 'Assistente IA', href: '/dashboard/ia',           icon: Sparkles,        section: 'financas'  },
]

type Props = { userName: string; userEmail: string }

export default function Sidebar({ userName, userEmail }: Props) {
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

  return (
    <aside className="w-[220px] min-w-[220px] h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Car size={16} className="text-white" />
        </div>
        <span className="font-semibold text-[15px] text-gray-900">AutoGest</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-2 mb-1">
          Principal
        </p>
        {navItems.filter(i => i.section === 'principal').map(item => (
          <Link
            key={item.href} href={item.href}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors group ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={16} className={isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
            {item.label}
            {isActive(item.href) && <ChevronRight size={12} className="ml-auto text-blue-400" />}
          </Link>
        ))}

        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-2 mt-4 mb-1">
          Finanças & IA
        </p>
        {navItems.filter(i => i.section === 'financas').map(item => {
          const active = isActive(item.href)
          const isIA   = item.href.includes('ia')
          return (
            <Link
              key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors group ${
                active
                  ? isIA ? 'bg-purple-50 text-purple-700 font-medium' : 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={16} className={
                active
                  ? isIA ? 'text-purple-600' : 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-600'
              } />
              {item.label}
              {isIA && !active && (
                <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">Pro</span>
              )}
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}

        <div className="mt-auto pt-4">
          <Link
            href="/dashboard/configuracoes"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings size={16} className="text-gray-400" />
            Configurações
          </Link>
        </div>
      </nav>

      {/* Usuário */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-medium text-blue-700 flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-gray-900 truncate">{userName || 'Usuário'}</p>
            <p className="text-[11px] text-gray-400 truncate">{userEmail}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" title="Sair">
            <LogOut size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </aside>
  )
}
