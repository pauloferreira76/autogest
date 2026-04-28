'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Plus } from 'lucide-react'
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
  '/dashboard':             { label: 'Novo veículo',        href: '/dashboard/veiculos/novo'    },
  '/dashboard/veiculos':    { label: 'Novo veículo',        href: '/dashboard/veiculos/novo'    },
  '/dashboard/despesas':    { label: 'Nova despesa',        href: '/dashboard/despesas/nova'    },
  '/dashboard/manutencoes': { label: 'Agendar manutenção',  href: '/dashboard/manutencoes/nova' },
}

type Props = { userName: string }

export default function Topbar({ userName }: Props) {
  const pathname = usePathname()
  const page = pages[pathname] ?? { title: 'AutoGest', sub: '' }
  const cta  = ctas[pathname]
  const nome = userName?.split(' ')[0] || 'usuário'

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
        <button className="notif-btn">
          <Bell size={16} style={{ color: 'var(--ink-4)' }} />
          <span className="notif-dot" />
        </button>
      </div>
    </header>
  )
}
