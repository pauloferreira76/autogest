import Link from 'next/link'
import { Car, Wrench, DollarSign, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  { icon: Car,        title: 'Cadastro de veículos',    desc: 'Gerencie múltiplos carros em um só lugar com histórico completo.' },
  { icon: Wrench,     title: 'Controle de manutenções', desc: 'Alertas automáticos para revisões, trocas de óleo e serviços.' },
  { icon: DollarSign, title: 'Gestão financeira',       desc: 'Rastreie todos os gastos e veja para onde vai seu dinheiro.' },
  { icon: Sparkles,   title: 'IA integrada',            desc: 'Análise inteligente de gastos e recomendações personalizadas.' },
]

const planos = [
  {
    nome: 'Free',
    preco: 'R$ 0',
    periodo: 'para sempre',
    descricao: 'Para começar',
    itens: ['1 veículo', 'Manutenções e despesas', 'Dashboard básico'],
    cta: 'Começar grátis',
    href: '/cadastro',
    destaque: false,
  },
  {
    nome: 'Pro',
    preco: 'R$ 19,90',
    periodo: 'por mês',
    descricao: 'Para quem leva a sério',
    itens: ['Veículos ilimitados', 'Assistente IA completo', 'OCR de notas fiscais', 'Relatórios avançados', 'Notificações por e-mail'],
    cta: 'Assinar Pro',
    href: '/cadastro?plano=pro',
    destaque: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900">AutoGest</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium mb-6">
          <Sparkles size={12} />
          IA integrada com Claude
        </span>
        <h1 className="text-5xl font-semibold text-gray-900 leading-tight mb-6">
          Gestão automotiva<br />
          <span className="text-blue-600">inteligente</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Controle manutenções, rastreie gastos e receba recomendações de IA
          personalizadas para os seus veículos.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Criar conta grátis
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">
          Tudo que você precisa em um só lugar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-5 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon size={20} className="text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">
          Planos simples e transparentes
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {planos.map((p) => (
            <div
              key={p.nome}
              className={`p-6 rounded-2xl border ${
                p.destaque
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {p.destaque && (
                <span className="inline-block text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium mb-4">
                  Mais popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.nome}</h3>
              <p className="text-xs text-gray-400 mb-3">{p.descricao}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{p.preco}</span>
                <span className="text-sm text-gray-400 ml-1">{p.periodo}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.itens.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  p.destaque
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
            <Car size={10} className="text-white" />
          </div>
          <span className="font-medium text-gray-600">AutoGest</span>
        </div>
        <p>Gestão automotiva inteligente para motoristas brasileiros.</p>
      </footer>
    </div>
  )
}
