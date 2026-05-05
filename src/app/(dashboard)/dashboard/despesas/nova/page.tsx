'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { categoriasLabel } from '@/lib/utils'
import {
  ArrowLeft, Loader2, Upload, Camera,
  CheckCircle, AlertTriangle, X, Sparkles, FileImage,
} from 'lucide-react'
import Link from 'next/link'
import type { Veiculo, CategoriasDespesa } from '@/types'

type OCRStatus = 'idle' | 'processando' | 'sucesso' | 'erro'
type OCRResultado = {
  valor: number; data: string; descricao: string
  categoria: CategoriasDespesa; estabelecimento: string; confianca: 'alta'|'media'|'baixa'; aviso_data?: string
}

export default function NovaDespesaPage() {
  const router   = useRouter()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)
  const [loading,  setLoading]  = useState(false)
  const [erro,     setErro]     = useState('')
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [ocrStatus,    setOcrStatus]    = useState<OCRStatus>('idle')
  const [ocrErro,      setOcrErro]      = useState('')
  const [ocrResultado, setOcrResultado] = useState<OCRResultado | null>(null)
  const [previewUrl,   setPreviewUrl]   = useState<string | null>(null)
  const [form, setForm] = useState({
    veiculo_id: '', categoria: 'combustivel' as CategoriasDespesa,
    descricao: '', valor: '', data: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('veiculos').select('*').eq('user_id', user.id).then(({ data }) => {
        if (data) { setVeiculos(data); if (data.length > 0) setForm(p => ({ ...p, veiculo_id: data[0].id })) }
      })
    })
  }, [])

  function set(field: string, value: string) { setForm(p => ({ ...p, [field]: value })) }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type.startsWith('image/')) setPreviewUrl(URL.createObjectURL(file))
    else setPreviewUrl(null)
    setOcrStatus('processando'); setOcrErro(''); setOcrResultado(null)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res  = await fetch('/api/ocr', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || data.error) { setOcrErro(data.error || 'Erro ao processar a nota.'); setOcrStatus('erro'); return }
      setOcrResultado(data); setOcrStatus('sucesso')
      setForm(p => ({ ...p, valor: String(data.valor), data: data.data || p.data, descricao: data.descricao || data.estabelecimento || '', categoria: data.categoria || 'outros' }))
    } catch { setOcrErro('Erro de conexão. Tente novamente.'); setOcrStatus('erro') }
  }

  function limparOCR() {
    setOcrStatus('idle'); setOcrErro(''); setOcrResultado(null); setPreviewUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErro('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('despesas').insert({
      user_id: user.id, veiculo_id: form.veiculo_id, categoria: form.categoria,
      descricao: form.descricao || null, valor: parseFloat(form.valor), data: form.data,
    })
    if (error) { setErro('Erro ao salvar despesa.'); setLoading(false); return }
    router.push('/dashboard/despesas'); router.refresh()
  }

  const confiancaCor   = { alta: 'var(--emerald)', media: 'var(--amber)', baixa: 'var(--rose)' }
  const confiancaLabel = { alta: 'Alta confiança', media: 'Confiança média — verifique os dados', baixa: 'Baixa confiança — confira manualmente' }

  return (
    <div style={{ maxWidth: 520 }}>
      <Link href="/dashboard/despesas" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', textDecoration: 'none' }}>
        <ArrowLeft size={14} /> Voltar
      </Link>

      {/* Card OCR */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--violet-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={15} style={{ color: 'var(--violet)' }} />
            </div>
            <div>
              <p className="card-title">Escanear nota fiscal</p>
              <p style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 1 }}>IA extrai os dados automaticamente</p>
            </div>
          </div>
          {ocrStatus !== 'idle' && (
            <button onClick={limparOCR} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <X size={13} /> Limpar
            </button>
          )}
        </div>

        <div style={{ padding: 20 }}>
          <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={handleFileChange} style={{ display: 'none' }} id="ocr-file" />

          {ocrStatus === 'idle' && (
            <label htmlFor="ocr-file" style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '28px 16px', borderRadius: 12, border: '2px dashed var(--bdr-2)', background: 'var(--surf-2)', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-bd)'; e.currentTarget.style.background = 'var(--violet-bg)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr-2)'; e.currentTarget.style.background = 'var(--surf-2)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--violet-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={20} style={{ color: 'var(--violet)' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Clique para enviar a nota</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>JPG, PNG, WEBP ou PDF · máx. 10MB</p>
                </div>
                <button type="button" className="btn btn-violet btn-sm" onClick={() => fileRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Upload size={13} /> Escolher arquivo
                </button>
              </div>
            </label>
          )}

          {ocrStatus === 'processando' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '28px 16px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--violet-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={20} style={{ color: 'var(--violet)', animation: 'spin 1s linear infinite' }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Analisando a nota fiscal...</p>
              <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>A IA está extraindo os dados</p>
            </div>
          )}

          {ocrStatus === 'erro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="alert alert-rose"><AlertTriangle size={14} style={{ flexShrink: 0 }} /><span>{ocrErro}</span></div>
              <button type="button" className="btn btn-sm" onClick={limparOCR}>Tentar novamente</button>
            </div>
          )}

          {ocrStatus === 'sucesso' && ocrResultado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {previewUrl
                  ? <img src={previewUrl} alt="Nota" style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1.5px solid var(--bdr)' }} />
                  : <div style={{ width: 72, height: 72, borderRadius: 10, background: 'var(--surf-2)', border: '1.5px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileImage size={22} style={{ color: 'var(--ink-4)' }} /></div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <CheckCircle size={13} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--emerald-t)' }}>Dados extraídos com sucesso</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      { label: 'Valor', value: `R$ ${ocrResultado.valor?.toFixed(2).replace('.', ',')}` },
                      { label: 'Data',  value: ocrResultado.data ? new Date(ocrResultado.data + 'T00:00:00').toLocaleDateString('pt-BR') : '—' },
                      { label: 'Categoria', value: categoriasLabel[ocrResultado.categoria] || ocrResultado.categoria },
                      { label: 'Local', value: ocrResultado.estabelecimento || '—' },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '7px 10px', borderRadius: 8, background: 'var(--surf-2)', border: '1px solid var(--bdr)' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{item.label}</p>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'var(--surf-2)', border: '1px solid var(--bdr)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: confiancaCor[ocrResultado.confianca], flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-3)' }}>{confiancaLabel[ocrResultado.confianca]}</span>
              </div>
              {ocrResultado.aviso_data && (
                <div className="alert alert-amber" style={{ marginTop: 8 }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11 }}>{ocrResultado.aviso_data}</span>
                </div>
              )}
              <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>Os campos abaixo foram preenchidos automaticamente. Revise antes de salvar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Formulário */}
      <div className="card">
        <div className="card-header"><p className="card-title">Dados da despesa</p></div>
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="metric-label" style={{ display: 'block', marginBottom: 6 }}>Veículo *</label>
            <select value={form.veiculo_id} onChange={e => set('veiculo_id', e.target.value)} required>
              {veiculos.length === 0 && <option value="">Carregando...</option>}
              {veiculos.map(v => <option key={v.id} value={v.id}>{v.apelido}</option>)}
            </select>
          </div>
          <div>
            <label className="metric-label" style={{ display: 'block', marginBottom: 6 }}>Categoria *</label>
            <select value={form.categoria} onChange={e => set('categoria', e.target.value)} required>
              {Object.entries(categoriasLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="metric-label" style={{ display: 'block', marginBottom: 6 }}>Descrição</label>
            <input type="text" value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Ex: Abastecimento posto Shell" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="metric-label" style={{ display: 'block', marginBottom: 6 }}>Valor (R$) *</label>
              <input type="number" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="150,00" min="0.01" step="0.01" required
                style={ocrStatus === 'sucesso' ? { borderColor: 'var(--emerald)', background: 'var(--emerald-bg)' } : {}} />
            </div>
            <div>
              <label className="metric-label" style={{ display: 'block', marginBottom: 6 }}>Data *</label>
              <input type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
            </div>
          </div>
          {erro && <div className="alert alert-rose"><AlertTriangle size={14} />{erro}</div>}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Link href="/dashboard/despesas" className="btn" style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>Cancelar</Link>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Salvando...' : 'Salvar despesa'}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
