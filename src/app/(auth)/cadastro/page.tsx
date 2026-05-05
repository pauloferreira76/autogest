'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Car, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export default function CadastroPage() {
  const [nome,    setNome]    = useState('')
  const [email,   setEmail]   = useState('')
  const [senha,   setSenha]   = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')
  const [sucesso, setSucesso] = useState(false)
  const supabase = createClient()

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErro('')
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); setLoading(false); return }
    const { error } = await supabase.auth.signUp({
      email, password: senha,
      options: { data: { full_name: nome }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setErro(error.message === 'User already registered' ? 'Este e-mail já está cadastrado. Faça login.' : 'Erro ao criar conta. Tente novamente.')
      setLoading(false); return
    }
    setSucesso(true); setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    fontSize: 14, color: '#0c0e1a',
    background: '#f8f9fd', border: '1.5px solid #e2e7f2',
    borderRadius: 10, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color .15s',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: '#6b7280',
    textTransform: 'uppercase' as const, letterSpacing: '.06em',
    display: 'block', marginBottom: 6,
  }

  if (sucesso) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0e1a 0%, #1a1f3a 50%, #0c1a2e 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.4)' }}>
        <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', padding: '28px 28px 24px', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <CheckCircle size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-.5px', marginBottom: 6 }}>Conta criada!</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)' }}>Verifique seu e-mail para ativar</p>
        </div>
        <div style={{ padding: '24px 28px' }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, textAlign: 'center', marginBottom: 20 }}>
            Enviamos um link de confirmação para <strong style={{ color: '#0c0e1a' }}>{email}</strong>. Clique nele para ativar sua conta.
          </p>
          <Link href="/login" style={{ display: 'block', padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700, background: '#1a56db', color: '#fff', borderRadius: 10, textDecoration: 'none' }}>
            Ir para o login
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0e1a 0%, #1a1f3a 50%, #0c1a2e 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
        <div style={{ width: 44, height: 44, background: '#1a56db', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 6px rgba(26,86,219,.15)' }}>
          <Car size={22} color="#fff" />
        </div>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>AutoGest</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.4)' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a56db, #1035a0)', padding: '28px 28px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.5px', marginBottom: 6 }}>Criar conta grátis</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)' }}>Sem cartão de crédito · Cancele quando quiser</p>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <button onClick={handleGoogle} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 16px', background: '#fff', border: '1.5px solid #e2e7f2', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'inherit', transition: 'all .15s', marginBottom: 16 }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8f9fd'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-5 7.2v6h8.1c4.7-4.4 7.2-10.8 7.2-17.3z"/>
              <path fill="#34A853" d="M24 48c5.94 0 10.92-1.97 14.56-5.33l-8.1-6c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
            Cadastrar com Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e2e7f2' }} />
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>ou com e-mail</span>
            <div style={{ flex: 1, height: 1, background: '#e2e7f2' }} />
          </div>

          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Nome completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                placeholder="João Silva" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e7f2'} />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e7f2'} />
            </div>
            <div>
              <label style={labelStyle}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="mínimo 6 caracteres" required
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#e2e7f2'} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff1f2', border: '1.5px solid #fda4af', borderRadius: 10, fontSize: 13, color: '#9f1239', fontWeight: 500 }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {erro}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 12, background: loading ? '#6b9ff5' : '#1a56db', color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1647c1' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a56db' }}>
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>
        </div>

        <div style={{ padding: '16px 28px 24px', textAlign: 'center', borderTop: '1px solid #f1f4fb' }}>
          <p style={{ fontSize: 13, color: '#6b7280' }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#1a56db', fontWeight: 700, textDecoration: 'none' }}>Entrar</Link>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,.35)">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
        Conexão segura · Seus dados estão protegidos
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
