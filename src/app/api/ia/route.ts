import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    // Busca dados reais do usuário logado
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const [{ data: veiculos }, { data: despesas }, { data: manutencoes }] = await Promise.all([
      supabase.from('veiculos').select('*').eq('user_id', user.id),
      supabase.from('despesas').select('*').eq('user_id', user.id).order('data', { ascending: false }).limit(50),
      supabase.from('manutencoes').select('*').eq('user_id', user.id).order('data_prevista'),
    ])

    // Monta contexto dinâmico com dados reais
    const contexto = `Você é o assistente de IA do AutoGest, um SaaS de gestão automotiva para motoristas brasileiros.

Dados do usuário (${user.email}):

VEÍCULOS:
${veiculos?.map(v => `- ${v.apelido}: ${v.marca} ${v.modelo} ${v.ano}, placa ${v.placa || 'não informada'}, ${v.quilometragem} km`).join('\n') || 'Nenhum veículo cadastrado'}

ÚLTIMAS DESPESAS (máx. 50):
${despesas?.map(d => `- ${d.data} | ${d.categoria} | R$ ${Number(d.valor).toFixed(2)} | ${d.descricao || ''}`).join('\n') || 'Nenhuma despesa registrada'}

MANUTENÇÕES:
${manutencoes?.map(m => `- ${m.tipo} | status: ${m.status} | previsto: ${m.data_prevista || 'sem data'} | custo: ${m.custo ? `R$ ${m.custo}` : 'não informado'}`).join('\n') || 'Nenhuma manutenção cadastrada'}

Regras de resposta:
- Responda sempre em português do Brasil
- Seja direto, amigável e use os dados reais acima
- Forneça números e cálculos concretos quando possível
- Respostas concisas (máx. 3 parágrafos curtos)
- Não use markdown com asteriscos, apenas texto limpo`

    // Monta histórico de mensagens
    const mensagens = [
      ...history.slice(-8), // Mantém últimas 8 mensagens para contexto
      { role: 'user', content: message }
    ]

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
        system: contexto,
        messages: mensagens,
      }),
    })

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Não consegui processar sua pergunta.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Erro na API de IA:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
