'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Send, Sparkles, Loader2, DollarSign, Wrench, TrendingUp, Car, Lock } from 'lucide-react'
import Link from 'next/link'

type Message = { role: 'user' | 'assistant'; content: string }

const sugestoes = [
  { icon: DollarSign, label: 'Quanto estou gastando por km?'           },
  { icon: Wrench,     label: 'Quais manutenções estão próximas?'        },
  { icon: TrendingUp, label: 'Como reduzir meus gastos com combustível?' },
  { icon: Car,        label: 'Compare meus veículos em custos'           },
]

export default function IAPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente IA do AutoGest. Analisei os dados dos seus veículos e estou pronto para ajudar. O que você quer saber?' }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [plano,   setPlano]   = useState<'free' | 'pro' | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('plano').eq('id', user.id).single()
        .then(({ data }) => setPlano(data?.plano ?? 'free'))
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: msg }])

    try {
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages }),
      })

      const data = await res.json()

      if (res.status === 403) {
        setPlano('free')
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Desculpe, não consegui processar sua pergunta.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro de conexão. Tente novamente.' }])
    }

    setLoading(false)
  }

  // Tela de bloqueio para plano free
  if (plano === 'free') {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-purple-500" />
          </div>
          <h2 className="text-[18px] font-semibold text-gray-900 mb-2">
            Assistente IA exclusivo do plano Pro
          </h2>
          <p className="text-[14px] text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Faça upgrade para ter acesso ao assistente que analisa seus gastos, 
            compara veículos e dá recomendações personalizadas.
          </p>

          <div className="bg-purple-50 rounded-xl p-5 mb-8 text-left max-w-sm mx-auto">
            <p className="text-[12px] font-medium text-purple-700 mb-3">O que você ganha no Pro:</p>
            {[
              'Assistente IA ilimitado',
              'Análise de gastos por IA',
              'Veículos ilimitados',
              'OCR de notas fiscais',
              'Relatórios avançados',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[13px] text-purple-800">{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/configuracoes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-[14px] font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Sparkles size={16} />
            Fazer upgrade para Pro — R$ 19,90/mês
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
          <Sparkles size={18} className="text-purple-600" />
        </div>
        <div>
          <p className="text-[14px] font-medium text-gray-900">Assistente IA</p>
          <p className="text-[12px] text-gray-400">Powered by OpenRouter · Analisa seus dados em tempo real</p>
        </div>
        <span className="ml-auto text-[11px] bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">Pro</span>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-400" />
                <span className="text-[13px] text-gray-400">Analisando seus dados...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-5 pb-3 grid grid-cols-2 gap-2">
            {sugestoes.map(s => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.label)}
                className="flex items-center gap-2 p-3 text-left text-[12px] text-gray-600 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <s.icon size={14} className="text-gray-400 flex-shrink-0" />
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 p-3">
          <div className="flex gap-2">
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Pergunte sobre seus veículos..."
              disabled={loading}
              className="flex-1 px-3 py-2.5 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
