'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro]     = useState('')
  const router  = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('E-mail ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Entrar</h1>
        <p className="text-sm text-gray-400 mb-6">Bem-vindo de volta ao AutoGest</p>

        {/* Login com Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-5 7.2v6h8.1c4.7-4.4 7.2-10.8 7.2-17.3z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.8 2.2-6 0-11.1-4-12.9-9.5H2.8v6.2C6.8 42.6 14.8 48 24 48z"/>
            <path fill="#FBBC05" d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-6.2H2.8C1 17.3 0 20.5 0 24s1 6.7 2.8 9.1l8.3-4.2z"/>
            <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.9 2.5 30.5 0 24 0 14.8 0 6.8 5.4 2.8 13.3l8.3 6.2C12.9 13.5 18 9.5 24 9.5z"/>
          </svg>
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">ou com e-mail</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {erro && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-blue-600 font-medium hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  )
}
