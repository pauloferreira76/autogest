'use client'

type Props = { uri: string }

export default function MFAQRCode({ uri }: Props) {
  if (!uri) return (
    <div style={{
      width: 220, height: 220, borderRadius: 12,
      background: 'var(--surf-2)', border: '1.5px solid var(--bdr)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, color: 'var(--ink-4)',
    }}>Gerando QR Code...</div>
  )

  // Supabase retorna SVG direto — usa como src da imagem
  if (uri.startsWith('data:image/svg') || uri.startsWith('data:image/png')) {
    return (
      <img src={uri} alt="QR Code MFA"
        style={{
          width: 220, height: 220, borderRadius: 12,
          border: '1.5px solid var(--bdr)', display: 'block',
          background: '#fff',
        }} />
    )
  }

  // Fallback: URI otpauth:// — mostra mensagem para usar chave manual
  return (
    <div style={{
      width: 220, height: 220, borderRadius: 12,
      background: 'var(--surf-2)', border: '1.5px solid var(--bdr)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', padding: 16,
    }}>Use a chave manual ao lado para configurar</div>
  )
}
