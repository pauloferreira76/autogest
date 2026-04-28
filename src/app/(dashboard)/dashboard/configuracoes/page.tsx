'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Shield, Mail, Sparkles, Loader2 } from 'lucide-react'

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [user,    setUser]    = useState<any>(null)
  const [plano,   setPlano]   = useState<'free' | 'pro'>('free')
  const [loading, setLoading] = useState(false)
  const [msg,     setMsg]     = useState('')
  const [erro,    setErro]    = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUser(user)
      supabase.from('profiles').select('plano').eq('id', user.id).single()
        .then(({ data }) => setPlano(data?.plano ?? 'free'))
    })

    const params = new URLSearchParams(window.location.search)
    if (params.get('upgrade') === 'success') {
      setMsg('🎉 Upgrade realizado com sucesso! Bem-vindo ao Pro!')
    }
  }, [])

  async function handleUpgrade() {
    setLoading(true)
    setErro('')
    try {
      console.log('Iniciando checkout...')
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      console.log('Status:', res.status)
      const data = await res.json()
      console.log('Resposta:', data)

      if (data.url) {
        window.location.href = data.url
      } else {
        setErro(data.error || 'Erro ao iniciar checkout.')
      }
    } catch (err: any) {
      console.error('Erro:', err)
      setErro('Erro de conexão: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      {msg && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-[13px] text-green-700">
          {msg}
        </div>
      )}
      {erro && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-700">
          ⚠️ {erro}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {/* Perfil */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-gray-400" />
            <h2 className="text-[14px] font-medium text-gray-900">Perfil</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1">Nome</label>
              <p className="text-[13px] text-gray-900">{user?.user_metadata?.full_name || '—'}</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1">E-mail</label>
              <p className="text-[13px] text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Plano */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-gray-400" />
            <h2 className="text-[14px] font-medium text-gray-900">Plano atual</h2>
          </div>

          {plano === 'pro' ? (
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] font-medium text-purple-900">Plano Pro</p>
                  <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-medium">Ativo</span>
                </div>
                <p className="text-[12px] text-purple-600">Veículos ilimitados · IA · Todos os recursos</p>
              </div>
              <Sparkles size={20} className="text-purple-500" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-[13px] font-medium text-gray-900">Plano Free</p>
                  <p className="text-[12px] text-gray-400">1 veículo · Sem IA</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-purple-900 mb-1">Upgrade para Pro</p>
                    <p className="text-[12px] text-purple-600 mb-3">Veículos ilimitados · Assistente IA · OCR de notas</p>
                    <p className="text-[20px] font-bold text-purple-900">
                      R$ 19,90<span className="text-[13px] font-normal text-purple-500">/mês</span>
                    </p>
                  </div>
                  <Sparkles size={24} className="text-purple-400 flex-shrink-0 mt-1" />
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white text-[13px] font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? 'Redirecionando...' : 'Assinar Pro agora'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notificações */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={16} className="text-gray-400" />
            <h2 className="text-[14px] font-medium text-gray-900">Notificações</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Alertas de manutenção por e-mail', desc: 'Receba avisos quando uma revisão estiver próxima' },
              { label: 'Resumo mensal de gastos',          desc: 'Relatório automático todo dia 1º do mês' },
            ].map(item => (
              <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 accent-blue-600" />
                <div>
                  <p className="text-[13px] font-medium text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-400">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
