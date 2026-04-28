import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verifica o plano do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('plano')
      .eq('id', user.id)
      .single()

    if (!profile || profile.plano !== 'pro') {
      return NextResponse.json({
        error: 'plano_free',
        reply: 'O assistente IA é exclusivo do plano Pro. Faça upgrade para ter acesso!'
      }, { status: 403 })
    }

    const [{ data: veiculos }, { data: despesas }, { data: manutencoes }] = await Promise.all([
      supabase.from('veiculos').select('*').eq('user_id', user.id),
      supabase.from('despesas').select('*').eq('user_id', user.id).order('data', { ascending: false }).limit(50),
      supabase.from('manutencoes').select('*').eq('user_id', user.id).order('data_prevista'),
    ])

    const contexto = `Você é o assistente de IA do AutoGest, um SaaS de gestão automotiva para motoristas brasileiros.

Dados do usuário (${user.email}):

VEÍCULOS:
${veiculos?.map(v => `- ${v.apelido}: ${v.marca} ${v.modelo} ${v.ano}, placa ${v.placa || 'não informada'}, ${v.quilometragem} km`).join('\n') || 'Nenhum veículo cadastrado'}

ÚLTIMAS DESPESAS:
${despesas?.map(d => `- ${d.data} | ${d.categoria} | R$ ${Number(d.valor).toFixed(2)} | ${d.descricao || ''}`).join('\n') || 'Nenhuma despesa registrada'}

MANUTENÇÕES:
${manutencoes?.map(m => `- ${m.tipo} | status: ${m.status} | previsto: ${m.data_prevista || 'sem data'} | custo: ${m.custo ? 'R$ ' + m.custo : 'não informado'}`).join('\n') || 'Nenhuma manutenção cadastrada'}

Responda sempre em português do Brasil, de forma direta e amigável. Respostas concisas, sem markdown com asteriscos.`

    const mensagens = [
      ...history.slice(-8),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://autogest.upclouds.com.br',
        'X-Title': 'AutoGest',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: contexto },
          ...mensagens,
        ],
        max_tokens: 1024,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('OpenRouter error:', data.error)
      return NextResponse.json({ reply: 'Erro ao conectar com a IA. Tente novamente.' })
    }

    const reply = data.choices?.[0]?.message?.content || 'Não consegui processar sua pergunta.'
    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Erro na API de IA:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
