import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://autogest.upclouds.com.br'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/dashboard/configuracoes?upgrade=cancelled`,
      metadata: { user_id: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: error.message || 'Erro ao criar sessão' }, { status: 500 })
  }
}
