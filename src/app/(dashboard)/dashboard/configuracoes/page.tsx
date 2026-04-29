'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useMFA } from '@/hooks/useMFA'
import MFAQRCode from '@/components/dashboard/MFAQRCode'
import {
  User, Shield, Bell, CreditCard, Database,
  Lock, Smartphone, LogOut, Download, AlertTriangle,
  CheckCircle, Eye, EyeOff, Trash2, ChevronRight,
  RefreshCw, Globe,
} from 'lucide-react'

type Tab = 'perfil' | 'seguranca' | 'notificacoes' | 'assinatura' | 'dados'

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const mfa      = useMFA()

  const [tab,      setTab]      = useState<Tab>('perfil')
  const [user,     setUser]     = useState<any>(null)
  const [nome,     setNome]     = useState('')
  const [telefone, setTelefone] = useState('')
  const [msgPerfil, setMsgPerfil] = useState({ texto: '', tipo: '' })

  // Senha
  const [senhaAtual,  setSenhaAtual]  = useState('')
  const [senhaNova,   setSenhaNova]   = useState('')
  const [senhaConf,   setSenhaConf]   = useState('')
  const [showSenha,   setShowSenha]   = useState(false)
  const [forcaSenha,  setForcaSenha]  = useState(0)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [msgSenha,    setMsgSenha]    = useState({ texto: '', tipo: '' })

  // MFA OTP
  const [otp, setOtp] = useState(['','','','','',''])

  // Notificações
  const [notifs, setNotifs] = useState({
    manutencao: true, resumo: true, seguranca: true, novidades: false, ia: true,
  })

  // Confirmar exclusão
  const [confirmaExclusao, setConfirmaExclusao] = useState(false)
  const [loadingDados,     setLoadingDados]      = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUser(user)
      setNome(user.user_metadata?.full_name || '')
      setTelefone(user.user_metadata?.phone || '')
    })
    mfa.buscarFatores()
  }, [])

  function limparMsg(setter: any) {
    setTimeout(() => setter({ texto: '', tipo: '' }), 4000)
  }

  // ── Salvar perfil ─────────────────────────────────────────
  async function salvarPerfil() {
    const { error } = await supabase.auth.updateUser({ data: { full_name: nome, phone: telefone } })
    if (error) {
      setMsgPerfil({ texto: 'Erro ao salvar perfil.', tipo: 'erro' })
    } else {
      setMsgPerfil({ texto: 'Perfil atualizado com sucesso!', tipo: 'ok' })
    }
    limparMsg(setMsgPerfil)
  }

  // ── Calcular força da senha ───────────────────────────────
  function calcForca(senha: string) {
    let s = 0
    if (senha.length >= 8)  s++
    if (senha.length >= 12) s++
    if (/[A-Z]/.test(senha)) s++
    if (/[0-9]/.test(senha)) s++
    if (/[^A-Za-z0-9]/.test(senha)) s++
    setForcaSenha(s)
  }

  // ── Alterar senha ─────────────────────────────────────────
  async function alterarSenha() {
    if (!senhaAtual || !senhaNova || !senhaConf) {
      setMsgSenha({ texto: 'Preencha todos os campos.', tipo: 'erro' }); limparMsg(setMsgSenha); return
    }
    if (senhaNova !== senhaConf) {
      setMsgSenha({ texto: 'As senhas não coincidem.', tipo: 'erro' }); limparMsg(setMsgSenha); return
    }
    if (senhaNova.length < 8) {
      setMsgSenha({ texto: 'A senha deve ter pelo menos 8 caracteres.', tipo: 'erro' }); limparMsg(setMsgSenha); return
    }
    setLoadingSenha(true)
    // Reautentica com a senha atual
    const { error: reAuthErr } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: senhaAtual,
    })
    if (reAuthErr) {
      setMsgSenha({ texto: 'Senha atual incorreta.', tipo: 'erro' })
      setLoadingSenha(false); limparMsg(setMsgSenha); return
    }
    const { error } = await supabase.auth.updateUser({ password: senhaNova })
    if (error) {
      setMsgSenha({ texto: 'Erro ao atualizar senha.', tipo: 'erro' })
    } else {
      setMsgSenha({ texto: 'Senha atualizada com sucesso!', tipo: 'ok' })
      setSenhaAtual(''); setSenhaNova(''); setSenhaConf(''); setForcaSenha(0)
    }
    setLoadingSenha(false); limparMsg(setMsgSenha)
  }

  // ── MFA OTP ───────────────────────────────────────────────
  function moverOTP(val: string, idx: number) {
    const novo = [...otp]; novo[idx] = val; setOtp(novo)
    if (val && idx < 5) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input')
      inputs[idx + 1]?.focus()
    }
  }

  async function confirmarMFA() {
    const codigo = otp.join('')
    if (codigo.length < 6) return
    const ok = await mfa.verificarCodigo(codigo)
    if (ok) setOtp(['','','','','',''])
  }

  async function desativarMFA() {
    const fator = mfa.factors.find(f => f.status === 'verified')
    if (fator) await mfa.desativarMFA(fator.id)
  }

  // ── Exportar dados ────────────────────────────────────────
  async function exportarCSV() {
    if (!user) return
    const { data } = await supabase.from('despesas').select('*, veiculos(apelido)').eq('user_id', user.id)
    const linhas = [
      'data,veiculo,categoria,descricao,valor',
      ...(data ?? []).map((d: any) =>
        `${d.data},${d.veiculos?.apelido ?? ''},${d.categoria},"${d.descricao ?? ''}",${Number(d.valor).toFixed(2)}`
      ),
    ]
    const blob = new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `autogest-dados-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  async function excluirDados() {
    if (!user) return
    setLoadingDados(true)
    await supabase.from('manutencoes').delete().eq('user_id', user.id)
    await supabase.from('despesas').delete().eq('user_id', user.id)
    await supabase.from('veiculos').delete().eq('user_id', user.id)
    setConfirmaExclusao(false)
    setLoadingDados(false)
    setMsgPerfil({ texto: 'Todos os dados foram excluídos.', tipo: 'ok' })
    limparMsg(setMsgPerfil)
  }

  const initials = nome
    ? nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || '??'

  const mfaAtivo = mfa.status === 'active' || mfa.factors.some(f => f.status === 'verified')

  const forcaLabel = ['', 'Muito fraca', 'Fraca', 'Moderada', 'Forte', 'Muito forte']
  const forcaCor   = ['', '#e11d48', '#d97706', '#d97706', '#059669', '#047857']

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'perfil',       label: 'Perfil',        icon: User       },
    { id: 'seguranca',    label: 'Segurança',      icon: Shield     },
    { id: 'notificacoes', label: 'Notificações',   icon: Bell       },
    { id: 'assinatura',   label: 'Assinatura',     icon: CreditCard },
    { id: 'dados',        label: 'Meus dados',     icon: Database   },
  ]

  // ── Helpers de UI ─────────────────────────────────────────
  function Card({ children }: { children: React.ReactNode }) {
    return <div className="card">{children}</div>
  }

  function CardHead({ icon: Icon, iconBg, iconColor, title, sub, right }: any) {
    return (
      <div className="card-header">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg }}>
            <Icon size={15} style={{ color: iconColor }} />
          </div>
          <div>
            <p className="card-title">{title}</p>
            {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{sub}</p>}
          </div>
        </div>
        {right}
      </div>
    )
  }

  function Alert({ msg }: { msg: { texto: string; tipo: string } }) {
    if (!msg.texto) return null
    return (
      <div className={`alert mt-3 ${msg.tipo === 'ok' ? 'alert-emerald' : 'alert-rose'}`}>
        {msg.tipo === 'ok'
          ? <CheckCircle size={14} style={{ flexShrink: 0 }} />
          : <AlertTriangle size={14} style={{ flexShrink: 0 }} />}
        {msg.texto}
      </div>
    )
  }

  return (
    <div className="flex gap-6 max-w-5xl" style={{ flexWrap: "wrap" }}>

      {/* Sidebar de navegação */}
      <div className="flex-shrink-0 flex gap-1" style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", minWidth: 0 }} >
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all text-left w-full"
            style={tab === t.id
              ? { background: 'var(--brand-bg)', color: 'var(--brand)', fontWeight: 700 }
              : { color: 'var(--ink-2)' }}>
            <t.icon size={14} style={{ flexShrink: 0 }} />
            {t.label}
            {tab === t.id && <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--brand)' }} />}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* ── PERFIL ── */}
        {tab === 'perfil' && (
          <Card>
            <CardHead icon={User} iconBg="var(--brand-bg)" iconColor="var(--brand)"
              title="Informações pessoais" sub="Nome, foto e dados de contato" />
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1.5px solid var(--bdr)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1a56db, #7c3aed)' }}>
                  {initials}
                </div>
                <div>
                  <p className="text-base font-bold" style={{ color: 'var(--ink)', letterSpacing: '-.3px' }}>
                    {nome || 'Usuário'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="badge badge-emerald flex items-center gap-1">
                      <CheckCircle size={9} /> E-mail verificado
                    </span>
                    {mfaAtivo && (
                      <span className="badge badge-violet flex items-center gap-1">
                        <Shield size={9} /> MFA ativo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="metric-label block mb-1.5">Nome completo</label>
                  <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
                </div>
                <div>
                  <label className="metric-label block mb-1.5">Telefone</label>
                  <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
                </div>
              </div>
              <div>
                <label className="metric-label block mb-1.5">E-mail</label>
                <input value={user?.email || ''} disabled style={{ opacity: .6, cursor: 'not-allowed' }} />
                <p className="text-xs mt-1" style={{ color: 'var(--ink-4)' }}>O e-mail não pode ser alterado.</p>
              </div>
              <Alert msg={msgPerfil} />
            </div>
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: '1.5px solid var(--bdr)', background: 'var(--surf-2)' }}>
              <span className="text-xs" style={{ color: 'var(--ink-4)' }}>
                Conta criada em {user ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}
              </span>
              <button className="btn btn-primary btn-sm" onClick={salvarPerfil}>
                Salvar alterações
              </button>
            </div>
          </Card>
        )}

        {/* ── SEGURANÇA ── */}
        {tab === 'seguranca' && (
          <>
            {/* Alterar senha */}
            <Card>
              <CardHead icon={Lock} iconBg="var(--amber-bg)" iconColor="var(--amber)"
                title="Alterar senha" sub="Recomendamos senhas com 12+ caracteres" />
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <label className="metric-label block mb-1.5">Senha atual</label>
                  <div className="relative">
                    <input type={showSenha ? 'text' : 'password'} value={senhaAtual}
                      onChange={e => setSenhaAtual(e.target.value)}
                      placeholder="••••••••••" style={{ paddingRight: 42 }} />
                    <button type="button" onClick={() => setShowSenha(!showSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="metric-label block mb-1.5">Nova senha</label>
                  <input type={showSenha ? 'text' : 'password'} value={senhaNova}
                    onChange={e => { setSenhaNova(e.target.value); calcForca(e.target.value) }}
                    placeholder="mínimo 8 caracteres" />
                  {senhaNova && (
                    <div className="mt-2">
                      <div className="strength-bar mb-1">
                        <div className="strength-fill"
                          style={{ width: `${(forcaSenha / 5) * 100}%`, background: forcaCor[forcaSenha] || 'var(--bdr)' }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: forcaCor[forcaSenha] }}>
                        {forcaLabel[forcaSenha]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="metric-label block mb-1.5">Confirmar nova senha</label>
                  <input type={showSenha ? 'text' : 'password'} value={senhaConf}
                    onChange={e => setSenhaConf(e.target.value)} placeholder="repita a nova senha" />
                  {senhaConf && senhaNova !== senhaConf && (
                    <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>As senhas não coincidem</p>
                  )}
                </div>
                <div className="alert alert-brand text-xs">
                  Use pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos.
                </div>
                <Alert msg={msgSenha} />
              </div>
              <div className="flex justify-end px-5 py-3"
                style={{ borderTop: '1.5px solid var(--bdr)', background: 'var(--surf-2)' }}>
                <button className="btn btn-primary btn-sm flex items-center gap-1.5"
                  disabled={loadingSenha} onClick={alterarSenha}>
                  {loadingSenha && <RefreshCw size={13} className="animate-spin" />}
                  {loadingSenha ? 'Atualizando...' : 'Atualizar senha'}
                </button>
              </div>
            </Card>

            {/* MFA */}
            <Card>
              <CardHead icon={Smartphone} iconBg="var(--violet-bg)" iconColor="var(--violet)"
                title="Autenticação em dois fatores (MFA)" sub="Proteção extra com código temporário"
                right={
                  <span className={`badge ${mfaAtivo ? 'badge-emerald' : 'badge-amber'}`}>
                    {mfaAtivo ? '✓ Ativado' : '⚠ Desativado'}
                  </span>
                } />
              <div className="p-5">

                {/* Inativo */}
                {!mfaAtivo && mfa.status !== 'enrolling' && (
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                        Aplicativo autenticador (TOTP)
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--ink-4)' }}>
                        Use Google Authenticator, Authy ou Microsoft Authenticator. Um código de 6 dígitos será
                        solicitado a cada login para proteger sua conta.
                      </p>
                    </div>
                    <button className="btn btn-sm btn-violet flex-shrink-0 flex items-center gap-1.5"
                      disabled={mfa.carregando} onClick={mfa.iniciarEnroll}>
                      {mfa.carregando ? <RefreshCw size={12} className="animate-spin" /> : <Smartphone size={12} />}
                      Configurar
                    </button>
                  </div>
                )}

                {/* Configurando — QR Code */}
                {mfa.status === 'enrolling' && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl" style={{ background: 'var(--surf-2)', border: '1.5px solid var(--bdr)' }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>
                        1. Escaneie o QR Code no aplicativo autenticador
                      </p>
                      <div className="flex items-center gap-4">
                        {mfa.qrCode ? (
                          <MFAQRCode uri={mfa.qrCode} />
                        ) : (





                          <div className="w-28 h-28 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ border: '1.5px solid var(--bdr)', background: 'var(--surf)' }}>
                            <RefreshCw size={22} className="animate-spin" style={{ color: 'var(--ink-4)' }} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--ink-4)' }}>Ou insira a chave manualmente:</p>
                          <code className="text-xs font-bold block p-2 rounded-lg mono break-all"
                            style={{ background: 'var(--surf)', border: '1.5px solid var(--bdr)', letterSpacing: 1 }}>
                            {mfa.secret || '—'}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>
                        2. Digite o código de 6 dígitos gerado pelo app
                      </p>
                      <div className="flex gap-2">
                        {otp.map((v, i) => (
                          <input key={i} className="otp-input" maxLength={1} value={v}
                            onChange={e => moverOTP(e.target.value, i)}
                            onKeyDown={e => {
                              if (e.key === 'Backspace' && !v && i > 0) {
                                const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input')
                                inputs[i - 1]?.focus()
                              }
                            }}
                            inputMode="numeric" />
                        ))}
                      </div>
                    </div>

                    {mfa.erro && (
                      <div className="alert alert-rose">
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {mfa.erro}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="btn btn-primary btn-sm flex items-center gap-1.5"
                        disabled={mfa.carregando || otp.join('').length < 6}
                        onClick={confirmarMFA}>
                        {mfa.carregando
                          ? <><RefreshCw size={13} className="animate-spin" /> Verificando...</>
                          : <><CheckCircle size={13} /> Confirmar e ativar</>}
                      </button>
                      <button className="btn btn-sm" onClick={mfa.cancelarEnroll}>Cancelar</button>
                    </div>
                  </div>
                )}

                {/* Ativo */}
                {mfaAtivo && (
                  <div className="flex flex-col gap-3">
                    <div className="alert alert-emerald">
                      <CheckCircle size={14} style={{ flexShrink: 0 }} />
                      MFA ativo — sua conta está protegida com autenticação em dois fatores.
                    </div>
                    {mfa.factors.filter(f => f.status === 'verified').map(f => (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'var(--surf-2)', border: '1.5px solid var(--bdr)' }}>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                            {f.friendly_name || 'Aplicativo autenticador'}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>
                            Adicionado em {new Date(f.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <button className="btn btn-sm btn-danger flex items-center gap-1.5"
                          disabled={mfa.carregando} onClick={desativarMFA}>
                          <LogOut size={12} /> Desativar MFA
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Sessões */}
            <Card>
              <CardHead icon={Globe} iconBg="var(--brand-bg)" iconColor="var(--brand)"
                title="Sessão atual" sub="Dispositivo com acesso ativo"
                right={
                  <button className="btn btn-sm btn-danger flex items-center gap-1.5"
                    onClick={async () => {
                      await supabase.auth.signOut({ scope: 'others' })
                      alert('Outras sessões encerradas!')
                    }}>
                    <LogOut size={12} /> Encerrar outras sessões
                  </button>
                } />
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--surf-2)' }}>
                  <Globe size={16} style={{ color: 'var(--ink-4)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                      {typeof window !== 'undefined'
                        ? (navigator.userAgent.includes('Chrome') ? 'Chrome' :
                           navigator.userAgent.includes('Firefox') ? 'Firefox' :
                           navigator.userAgent.includes('Safari') ? 'Safari' : 'Navegador')
                        : 'Navegador'}
                    </p>
                    <span className="badge badge-emerald">Esta sessão</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>Sessão ativa agora</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ── NOTIFICAÇÕES ── */}
        {tab === 'notificacoes' && (
          <Card>
            <CardHead icon={Bell} iconBg="var(--brand-bg)" iconColor="var(--brand)"
              title="Preferências de notificação" sub={`Enviadas para ${user?.email}`} />
            <div className="px-5 divide-y">
              {[
                { key: 'manutencao', title: 'Alertas de manutenção',  desc: 'E-mail quando uma revisão estiver próxima' },
                { key: 'resumo',     title: 'Resumo mensal de gastos', desc: 'Relatório automático todo dia 1º do mês' },
                { key: 'seguranca',  title: 'Alertas de segurança',   desc: 'Login em dispositivo novo ou acesso suspeito' },
                { key: 'ia',         title: 'Insights da IA',          desc: 'Dicas semanais baseadas nos seus dados' },
                { key: 'novidades',  title: 'Novidades do AutoGest',   desc: 'Novas funcionalidades e atualizações' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{n.desc}</p>
                  </div>
                  <button
                    className={`toggle ${notifs[n.key as keyof typeof notifs] ? 'on' : 'off'}`}
                    onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))}>
                    <div className="toggle-thumb" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end px-5 py-3"
              style={{ borderTop: '1.5px solid var(--bdr)', background: 'var(--surf-2)' }}>
              <button className="btn btn-primary btn-sm">Salvar preferências</button>
            </div>
          </Card>
        )}

        {/* ── ASSINATURA ── */}
        {tab === 'assinatura' && (
          <Card>
            <CardHead icon={CreditCard} iconBg="var(--violet-bg)" iconColor="var(--violet)"
              title="Assinatura" sub="Gerenciar plano e cobranças" />
            <div className="p-5 flex flex-col gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--violet-bg)', border: '1.5px solid var(--violet-bd)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold" style={{ color: 'var(--violet-t)', letterSpacing: '-.3px' }}>Pro + IA</span>
                  <span className="badge badge-violet">Ativo</span>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--violet-t)', opacity: .8 }}>
                  Renovação em 24/05/2026 · R$ 29,90/mês
                </p>
                <div className="flex gap-2">
                  <button className="btn btn-sm" style={{ color: 'var(--violet-t)', borderColor: 'var(--violet-bd)', background: 'var(--surf)' }}>
                    Alterar plano
                  </button>
                  <button className="btn btn-sm btn-danger">Cancelar assinatura</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>Histórico de cobranças</p>
                <div style={{ border: '1.5px solid var(--bdr)', borderRadius: 10, overflow: 'hidden' }}>
                  {[
                    { plan: 'Pro + IA · Mensal', date: '24/04/2026', value: 'R$ 29,90' },
                    { plan: 'Pro + IA · Mensal', date: '24/03/2026', value: 'R$ 29,90' },
                  ].map((c, i, arr) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--bdr)' : 'none', background: 'var(--surf)' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{c.plan}</p>
                        <p className="text-xs" style={{ color: 'var(--ink-4)' }}>{c.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold mono" style={{ color: 'var(--ink)' }}>{c.value}</span>
                        <span className="badge badge-emerald">Pago</span>
                        <button className="btn btn-sm" style={{ fontSize: 11 }}>Recibo</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── DADOS ── */}
        {tab === 'dados' && (
          <>
            <Card>
              <CardHead icon={Download} iconBg="var(--brand-bg)" iconColor="var(--brand)"
                title="Exportar meus dados" sub="Baixe uma cópia completa dos seus dados" />
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl"
                  style={{ border: '1.5px solid var(--bdr)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Despesas (CSV)</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>Histórico financeiro para planilhas</p>
                  </div>
                  <button className="btn btn-sm flex items-center gap-1.5" onClick={exportarCSV}>
                    <Download size={12} /> Exportar
                  </button>
                </div>
              </div>
            </Card>

            <div className="card" style={{ borderColor: 'var(--rose-bd)' }}>
              <div className="card-header" style={{ background: 'var(--rose-bg)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                    <AlertTriangle size={15} style={{ color: 'var(--rose)' }} />
                  </div>
                  <div>
                    <p className="card-title" style={{ color: 'var(--rose-t)' }}>Zona de perigo</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--rose)' }}>Ações permanentes e irreversíveis</p>
                  </div>
                </div>
              </div>
              <div className="divide-y px-5">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Excluir todos os dados</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>
                      Remove veículos, manutenções e despesas. A conta permanece ativa.
                    </p>
                  </div>
                  {!confirmaExclusao
                    ? <button className="btn btn-sm btn-danger flex items-center gap-1.5"
                        onClick={() => setConfirmaExclusao(true)}>
                        <Trash2 size={12} /> Excluir dados
                      </button>
                    : <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--rose)' }}>Confirmar?</span>
                        <button className="btn btn-sm btn-danger" disabled={loadingDados}
                          onClick={excluirDados}>
                          {loadingDados ? 'Excluindo...' : 'Sim, excluir'}
                        </button>
                        <button className="btn btn-sm" onClick={() => setConfirmaExclusao(false)}>Não</button>
                      </div>}
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Encerrar minha conta</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>
                      Exclui permanentemente sua conta e todos os dados. Irreversível.
                    </p>
                  </div>
                  <button className="btn btn-sm btn-danger flex items-center gap-1.5"
                    onClick={() => {
                      if (window.confirm('Tem certeza? Esta ação é irreversível.')) {
                        supabase.auth.signOut()
                      }
                    }}>
                    <Trash2 size={12} /> Encerrar conta
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
