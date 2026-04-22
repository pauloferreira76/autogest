'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Send, Sparkles, Loader2, Car, DollarSign, Wrench, TrendingUp } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const sugestoes = [
  { icon: DollarSign, label: 'Quanto estou gastando por km?'          },
  { icon: Wrench,     label: 'Quais manutenções estão próximas?'       },
  { icon: TrendingUp, label: 'Como reduzir meus gastos com combustível?' },
  { icon: Car,        label: 'Compare meus veículos em custos'          },
]

export default function IAPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente IA do AutoGest. Analisei os dados dos seus veículos e estou pronto para ajudar. O que você quer saber?' }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Desculpe, não consegui processar sua pergunta.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro de conexão. Tente novamente.' }])
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
          <Sparkles size={18} className="text-purple-600" />
        </div>
        <div>
          <p className="text-[14px] font-medium text-gray-900">Assistente IA</p>
          <p className="text-[12px] text-gray-400">Powered by Claude · Analisa seus dados em tempo real</p>
        </div>
        <span className="ml-auto text-[11px] bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">Pro</span>
      </div>

      {/* Chat */}
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

        {/* Sugestões — só mostra quando há apenas 1 mensagem */}
        {messages.length === 1 && (
          <div className="px-5 pb-3 grid grid-cols-2 gap-2">
            {sugestoes.map(s => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.label)}
                className="flex items-center gap-2 p-3 text-left text-[12px] text-gray-600 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-colors"
              >
                <s.icon size={14} className="text-gray-400 flex-shrink-0" />
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Pergunte sobre seus veículos..."
              disabled={loading}
              className="flex-1 px-3 py-2.5 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
