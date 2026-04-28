'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Plus } from 'lucide-react'
import { getSaudacao } from '@/lib/utils'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':               { title: 'Dashboard',      subtitle: 'Resumo geral dos seus veículos'    },
  '/dashboard/veiculos':      { title: 'Meus veículos',  subtitle: 'Gerencie sua frota pessoal'        },
  '/dashboard/manutencoes':   { title: 'Manutenções',    subtitle: 'Revisões e serviços agendados'     },
  '/dashboard/despesas':      { title: 'Despesas',       subtitle: 'Controle financeiro dos veículos'  },
  '/dashboard/ia':            { title: 'Assistente IA',  subtitle: 'Análise inteligente dos seus dados'},
  '/dashboard/configuracoes': { title: 'Configurações',  subtitle: 'Preferências da sua conta'         },
}

const ctaMap: Record<string, { label: string; href: string }> = {
  '/dashboard/veiculos':    { label: 'Novo veículo',       href: '/dashboard/veiculos/novo'    },
  '/dashboard/despesas':    { label: 'Nova despesa',       href: '/dashboard/despesas/nova'    },
  '/dashboard/manutencoes': { label: 'Agendar',            href: '/dashboard/manutencoes/nova' },
}

type Props = { userName: string }

export default function Topbar({ userName }: Props) {
  const pathname = usePathname()
  const page     = pageTitles[pathname] ?? { title: 'AutoGest', subtitle: '' }
  const cta      = ctaMap[pathname]
  const primeiroNome = userName?.split(' ')[0] || 'usuário'

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between flex-shrink-0">
      {/* Espaço para o botão hamburguer no mobile */}
      <div className="flex items-center gap-3">
        <div className="w-9 lg:hidden" /> {/* placeholder do hamburguer */}
        <div>
          <h1 className="text-[15px] lg:text-[16px] font-medium text-gray-900 leading-tight">
            {pathname === '/dashboard'
              ? `${getSaudacao()}, ${primeiroNome} 👋`
              : page.title}
          </h1>
          <p className="text-[11px] lg:text-[12px] text-gray-400 leading-tight hidden sm:block">
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {cta && (
          <Link
            href={cta.href}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[12px] lg:text-[13px] font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">{cta.label}</span>
            <span className="sm:hidden">Novo</span>
          </Link>
        )}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={18} className="text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
