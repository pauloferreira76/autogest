'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Car, Wrench, DollarSign, Sparkles } from 'lucide-react'

const items = [
  { label: 'Início',       href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Veículos',     href: '/dashboard/veiculos',    icon: Car             },
  { label: 'Manutenções',  href: '/dashboard/manutencoes', icon: Wrench          },
  { label: 'Despesas',     href: '/dashboard/despesas',    icon: DollarSign      },
  { label: 'IA',           href: '/dashboard/ia',          icon: Sparkles        },
]

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map(item => {
        const active = isActive(item.href)
        const isIA   = item.href.includes('/ia')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${active ? (isIA ? 'active-violet' : 'active') : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
