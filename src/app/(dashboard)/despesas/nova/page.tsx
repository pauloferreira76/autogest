'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { categoriasLabel } from '@/lib/utils'
import {
  ArrowLeft, Loader2, Upload, Camera,
  CheckCircle, AlertTriangle, X, Sparkles,
  FileImage,
} from 'lucide-react'
import Link from 'next/link'
import type { Veiculo, CategoriasDespesa } from '@/types'

type OCRStatus = 'idle' | 'processando' | 'sucesso' | 'erro'

type OCRResultado = {
  valor: number
  data: string
  descricao: string
  categoria: CategoriasDespesa
  estabelecimento: string
  confianca: 'alta' | 'media' | 'baixa'
}

export default function NovaDespesaPage() {
  const router   = useRouter()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [loading,  setLoading]  = useState(false)
  const [erro,     setErro]     = useState('')
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  // OCR states
  const [ocrStatus,    setOcrStatus]    = useState<OCRStatus>('idle')
  const [ocrErro,      setOcrErro]      = useState('')
  const [ocrResultado, setOcrResultado] = useState<OCRResultado | null>(null)
  const [previewUrl,   setPreviewUrl]   = useState<string | null>(null)

  const [form, setForm] = useState({
    veiculo_id: '',
    categoria:  'combustivel' as CategoriasDespesa,
    descricao:  '',
    valor:      '',
    data:       new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('veiculos').select('*').eq('user_id', user.id).then(({ data }) => {
        if (data) {
          setVeiculos(data)
          if (data.length > 0) setForm(p => ({ ...p, veiculo_id: data[0].id }))
        }
      })
    })
  }, [])

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  // ── OCR ──────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview da imagem
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }

    setOcrStatus('processando')
    setOcrErro('')
    setOcrResultado(null)

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res  = await fetch('/api/ocr', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok || data.error) {
        setOcrErro(data.error || 'Erro ao processar a nota.')
        setOcrStatus('erro')
        return
      }

      setOcrResultado(data)
      setOcrStatus('sucesso')

      // Preenche o formulário automaticamente
      setForm(p => ({
        ...p,
        valor:     String(data.valor),
        data:      data.data || p.data,
        descricao: data.descricao || data.estabelecimento || '',
        categoria: data.categoria || 'outros',
      }))
    } catch {
      setOcrErro('Erro de conexão. Tente novamente.')
      setOcrStatus('erro')
    }
  }

  function limparOCR() {
    setOcrStatus('idle')
    setOcrErro('')
    setOcrResultado(null)
    setPreviewUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Submit ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('despesas').insert({
      user_id:    user.id,
      veiculo_id: form.veiculo_id,
      categoria:  form.categoria,
      descricao:  form.descricao || null,
      valor:      parseFloat(form.valor),
      data:       form.data,
    })

    if (error) { setErro('Erro ao salvar despesa.'); setLoading(false); return }
    router.push('/dashboard/despesas'); router.refresh()
  }

  const confiancaCor = {
    alta:  'var(--emerald)',
    media: 'var(--amber)',
    baixa: 'var(--rose)',
  }

  const confiancaLabel = {
    alta:  'Alta confiança',
    media: 'Confiança média — verifique os dados',
    baixa: 'Baixa confiança — confira manualmente',
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/despesas"
        className="flex items-center gap-1.5 mb-5 text-sm font-medium"
        style={{ color: 'var(--ink-3)' }}>
        <ArrowLeft size={14} /> Voltar
      </Link>

      {/* OCR Card */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--violet-bg)' }}>
              <Sparkles size={15} style={{ color: 'var(--violet)' }} />
            </div>
            <div>
              <p className="card-title">Escanear nota fiscal</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>
                IA extrai os dados automaticamente
              </p>
            </div>
          </div>
          {ocrStatus !== 'idle' && (
            <button onClick={limparOCR} className="btn btn-ghost btn-sm">
              <X size={13} /> Limpar
            </button>
          )}
        </div>

        <div className="p-5">
          {/* Estado idle — área de upload */}
          {ocrStatus === 'idle' && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="ocr-file"
              />
              <label htmlFor="ocr-file">
                <div className="flex flex-col items-center justify-content gap-3 p-8 rounded-xl cursor-pointer transition-all"
                  style={{ border: '2px dashed var(--bdr-2)', background: 'var(--surf-2)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--violet-bd)'
                    e.currentTarget.style.background = 'var(--violet-bg)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--bdr-2)'
                    e.currentTarget.style.background = 'var(--surf-2)'
                  }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--violet-bg)' }}>
                    <Camera size={22} style={{ color: 'var(--violet)' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                      Clique para enviar a nota
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--ink-4)' }}>
                      JPG, PNG, WEBP ou PDF · máx. 10MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-violet btn-sm"
                      onClick={() => fileRef.current?.click()}>
                      <Upload size={13} /> Escolher arquivo
                    </button>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Estado processando */}
          {ocrStatus === 'processando' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--violet-bg)' }}>
                <Loader2 size={22} className="animate-spin" style={{ color: 'var(--violet)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                  Analisando a nota fiscal...
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--ink-4)' }}>
                  A IA está extraindo os dados
                </p>
              </div>
            </div>
          )}

          {/* Estado erro */}
          {ocrStatus === 'erro' && (
            <div className="flex flex-col gap-3">
              <div className="alert alert-rose">
                <AlertTriangle size={14} style={{ fill: 'var(--rose)' }} />
                <span>{ocrErro}</span>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={limparOCR}>
                Tentar novamente
              </button>
            </div>
          )}

          {/* Estado sucesso */}
          {ocrStatus === 'sucesso' && ocrResultado && (
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                {/* Preview */}
                {previewUrl && (
                  <img src={previewUrl} alt="Nota fiscal"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    style={{ border: '1.5px solid var(--bdr)' }} />
                )}
                {!previewUrl && (
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--surf-2)', border: '1.5px solid var(--bdr)' }}>
                    <FileImage size={24} style={{ color: 'var(--ink-4)' }} />
                  </div>
                )}

                {/* Dados extraídos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <span className="text-xs font-bold" style={{ color: 'var(--emerald-t)' }}>
                      Dados extraídos com sucesso
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'Valor',       value: `R$ ${ocrResultado.valor?.toFixed(2).replace('.', ',')}` },
                      { label: 'Data',        value: ocrResultado.data ? new Date(ocrResultado.data + 'T00:00:00').toLocaleDateString('pt-BR') : '—' },
                      { label: 'Categoria',   value: categoriasLabel[ocrResultado.categoria] || ocrResultado.categoria },
                      { label: 'Local',       value: ocrResultado.estabelecimento || '—' },
                    ].map(item => (
                      <div key={item.label} className="p-2 rounded-lg"
                        style={{ background: 'var(--surf-2)', border: '1px solid var(--bdr)' }}>
                        <p className="metric-label mb-0.5">{item.label}</p>
                        <p className="text-xs font-bold truncate" style={{ color: 'var(--ink)' }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge de confiança */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg"
                style={{ background: 'var(--surf-2)', border: '1px solid var(--bdr)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: confiancaCor[ocrResultado.confianca] }} />
                <span className="text-xs font-medium" style={{ color: 'var(--ink-3)' }}>
                  {confiancaLabel[ocrResultado.confianca]}
                </span>
              </div>

              <p className="text-xs" style={{ color: 'var(--ink-4)' }}>
                Os campos abaixo foram preenchidos automaticamente. Revise antes de salvar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formulário */}
      <div className="card">
        <div className="card-header">
          <p className="card-title">Dados da despesa</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="metric-label block mb-1.5">Veículo *</label>
            <select
              value={form.veiculo_id}
              onChange={e => set('veiculo_id', e.target.value)}
              required>
              {veiculos.length === 0 && <option value="">Carregando...</option>}
              {veiculos.map(v => (
                <option key={v.id} value={v.id}>{v.apelido}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="metric-label block mb-1.5">Categoria *</label>
            <select
              value={form.categoria}
              onChange={e => set('categoria', e.target.value)}
              required>
              {Object.entries(categoriasLabel).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="metric-label block mb-1.5">Descrição</label>
            <input
              type="text"
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Ex: Abastecimento posto Shell"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="metric-label block mb-1.5">Valor (R$) *</label>
              <input
                type="number"
                value={form.valor}
                onChange={e => set('valor', e.target.value)}
                placeholder="150,00"
                min="0.01"
                step="0.01"
                required
                style={ocrStatus === 'sucesso' ? { borderColor: 'var(--emerald)', background: 'var(--emerald-bg)' } : {}}
              />
            </div>
            <div>
              <label className="metric-label block mb-1.5">Data *</label>
              <input
                type="date"
                value={form.data}
                onChange={e => set('data', e.target.value)}
                required
              />
            </div>
          </div>

          {erro && (
            <div className="alert alert-rose">
              <AlertTriangle size={14} /> {erro}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Link href="/dashboard/despesas"
              className="btn flex-1 text-center">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
