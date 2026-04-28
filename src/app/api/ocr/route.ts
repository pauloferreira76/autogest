import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    // Verifica tipo do arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!tiposPermitidos.includes(file.type)) {
      return NextResponse.json({ error: 'Formato inválido. Use JPG, PNG, WEBP ou PDF.' }, { status: 400 })
    }

    // Verifica tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10MB.' }, { status: 400 })
    }

    // Converte para base64
    const bytes  = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaType = file.type === 'application/pdf' ? 'application/pdf' : file.type

    // Chama a API do Claude Vision para extrair dados da nota
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: mediaType === 'application/pdf' ? 'document' : 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64,
                },
              },
              {
                type: 'text',
                text: `Analise esta nota fiscal ou cupom fiscal e extraia as seguintes informações.
Responda APENAS com um JSON válido, sem texto adicional, sem markdown, sem explicações.

Formato exato:
{
  "valor": 150.50,
  "data": "2026-04-24",
  "descricao": "Abastecimento Shell",
  "categoria": "combustivel",
  "estabelecimento": "Posto Shell Centro",
  "confianca": "alta"
}

Regras:
- "valor": número decimal com o valor TOTAL da nota (sem R$, sem pontos de milhar)
- "data": formato YYYY-MM-DD. Se não encontrar, use a data de hoje
- "descricao": descrição curta do que foi comprado/pago (máx 60 caracteres)
- "estabelecimento": nome do estabelecimento/empresa emissora
- "categoria": escolha UMA das opções: combustivel, manutencao, seguro, multa, ipva, outros
  * combustivel: postos de gasolina, abastecimento
  * manutencao: oficinas, peças, pneus, revisão, borracharia
  * seguro: seguradoras, apólices
  * multa: infrações de trânsito, DETRAN
  * ipva: IPVA, licenciamento
  * outros: qualquer outra coisa
- "confianca": "alta" se os valores estão claros, "media" se há alguma dúvida, "baixa" se a imagem está ruim

Se não conseguir extrair o valor com certeza razoável, retorne: {"erro": "Não foi possível extrair os dados da nota"}`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Erro Claude API:', err)
      return NextResponse.json({ error: 'Erro ao processar a imagem' }, { status: 500 })
    }

    const data  = await response.json()
    const texto = data.content?.[0]?.text || ''

    // Parse do JSON retornado pelo Claude
    let resultado
    try {
      // Remove possível markdown se vier
      const limpo = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      resultado = JSON.parse(limpo)
    } catch {
      console.error('Erro ao parsear resposta:', texto)
      return NextResponse.json({ error: 'Não foi possível interpretar a nota fiscal' }, { status: 422 })
    }

    if (resultado.erro) {
      return NextResponse.json({ error: resultado.erro }, { status: 422 })
    }

    return NextResponse.json({
      valor:          resultado.valor,
      data:           resultado.data,
      descricao:      resultado.descricao,
      categoria:      resultado.categoria,
      estabelecimento: resultado.estabelecimento,
      confianca:      resultado.confianca,
    })

  } catch (error) {
    console.error('Erro no OCR:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
