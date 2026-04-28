'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Car, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email,    setEmail]   = useState('')
  const [senha,    setSenha]   = useState('')
  const [showPwd,  setShowPwd] = useState(false)
  const [loading,  setLoading] = useState(false)
  const [erro,     setErro]    = useState('')
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) { setErro('E-mail ou senha incorretos.'); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="auth-wrap">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: 'var(--brand)' }}>
          <Car size={18} className="text-white" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.5px' }}>AutoGest</span>
      </Link>

      <div className="auth-card">
        <div className="auth-card-header">
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.5px', marginBottom: 4 }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>Entre na sua conta para continuar</p>
        </div>

        <div className="auth-card-body">
          <button onClick={handleGoogle} disabled={loading} className="btn-google">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-5 7.2v6h8.1c4.7-4.4 7.2-10.8 7.2-17.3z"/>
              <path fill="#34A853" d="M24 48c5.94 0 10.92-1.97 14.56-5.33l-8.1-6c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="divider"><span>ou com e-mail</span></div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <label className="metric-label block mb-1.5">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="metric-label block mb-1.5">Senha</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••••" required
                  style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="alert alert-rose">
                <span>{erro}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full mt-1"
              style={{ padding: '11px', fontSize: 14 }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <div className="auth-card-footer">
          <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: 'var(--brand)', fontWeight: 700 }}>
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
