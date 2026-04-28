import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { uri } = body
    console.log('MFA-QR URI recebida:', uri?.substring(0, 100))
    if (!uri) return NextResponse.json({ error: 'URI obrigatória' }, { status: 400 })
    const dataUrl = await QRCode.toDataURL(uri, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'L',
    })
    return NextResponse.json({ dataUrl })
  } catch (err: any) {
    console.error('MFA-QR ERRO:', err?.message || err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
