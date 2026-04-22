import { NextRequest, NextResponse } from 'next/server'

// Webhook do Stripe para processar eventos de pagamento
// Configure o webhook em: https://dashboard.stripe.com/webhooks
// Endpoint: https://seu-dominio.com/api/webhooks/stripe

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sem assinatura' }, { status: 400 })
  }

  // TODO: Instalar stripe: npm install stripe
  // e implementar a validação e processamento dos eventos:
  //
  // import Stripe from 'stripe'
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  //
  // switch (event.type) {
  //   case 'checkout.session.completed':
  //     // Ativar plano Pro para o usuário
  //     break
  //   case 'customer.subscription.deleted':
  //     // Rebaixar para plano Free
  //     break
  // }

  return NextResponse.json({ received: true })
}
