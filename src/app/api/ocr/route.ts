import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const TIPOS_ACEITOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const PROMPT = `Você é um especialista em leitura de notas fiscais brasileiras.
Analise a imagem e extraia os dados. Responda SOMENTE com JSON válido, sem markdown, sem explicação.
{"valor":150.50,"data":"2026-01-15","descricao":"Abastecimento gasolina","categoria":"combustivel","estabelecimento":"Posto Ipiranga","confianca":"alta"}
Regras:
- valor: número decimal total da nota (sem R$)
- data: YYYY-MM-DD
- categoria: combustivel | manutencao | seguro | multa | ipva | outros
- confianca: alta | media | baixa
Se não conseguir extrair: {"erro":"motivo"}`

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    if (!TIPOS_ACEITOS.includes(file.type)) {
      return NextResponse.json({ error: 'Formato inválido. Envie uma foto JPG, PNG ou WEBP da nota.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://autogest.upclouds.com.br',
        'X-Title': 'AutoGest',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        max_tokens: 512,
        temperature: 0,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64}` } },
            { type: 'text', text: PROMPT },
          ],
        }],
      }),
    })

    if (!response.ok) {
      console.error('[OCR] OpenRouter error:', response.status, await response.text())
      return NextResponse.json({ error: 'Erro ao processar a imagem' }, { status: 500 })
    }

    const json    = await response.json()
    const rawText = json.choices?.[0]?.message?.content ?? ''

    let resultado: Record<string, unknown>
    try {
      resultado = JSON.parse(rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim())
    } catch {
      console.error('[OCR] JSON inválido:', rawText)
      return NextResponse.json({ error: 'Não foi possível interpretar a nota. Tente com imagem mais nítida.' }, { status: 422 })
    }

    if (resultado.erro) {
      return NextResponse.json({ error: String(resultado.erro) }, { status: 422 })
    }

    return NextResponse.json({
      valor:           Number(resultado.valor),
      data:            String(resultado.data            ?? new Date().toISOString().split('T')[0]),
      descricao:       String(resultado.descricao       ?? ''),
      categoria:       String(resultado.categoria       ?? 'outros'),
      estabelecimento: String(resultado.estabelecimento ?? ''),
      confianca:       String(resultado.confianca       ?? 'baixa'),
    })

  } catch (error) {
    console.error('[OCR] Erro inesperado:', error)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
