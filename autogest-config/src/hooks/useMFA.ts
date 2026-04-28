'use client'
import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export type MFAFactor = {
  id: string
  type: 'totp'
  status: 'verified' | 'unverified'
  created_at: string
  friendly_name?: string
}

export function useMFA() {
  const supabase = createClient()

  const [status,     setStatus]     = useState<'idle'|'enrolling'|'active'|'error'>('idle')
  const [qrCode,     setQrCode]     = useState('')
  const [secret,     setSecret]     = useState('')
  const [factorId,   setFactorId]   = useState('')
  const [factors,    setFactors]    = useState<MFAFactor[]>([])
  const [erro,       setErro]       = useState('')
  const [carregando, setCarregando] = useState(false)

  const buscarFatores = useCallback(async () => {
    setCarregando(true)
    const { data } = await supabase.auth.mfa.listFactors()
    const totp = (data?.totp ?? []) as MFAFactor[]
    setFactors(totp)
    if (totp.some(f => f.status === 'verified')) setStatus('active')
    setCarregando(false)
  }, [supabase])

  const iniciarEnroll = useCallback(async () => {
    setCarregando(true)
    setErro('')
    const { data: list } = await supabase.auth.mfa.listFactors()
    for (const f of list?.totp?.filter(f => f.status === 'unverified') ?? []) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `AutoGest-${new Date().toLocaleDateString('pt-BR')}`,
    })
    if (error) { setErro(error.message); setCarregando(false); return }
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
    setStatus('enrolling')
    setCarregando(false)
  }, [supabase])

  const verificarCodigo = useCallback(async (codigo: string) => {
    if (!factorId) { setErro('Reinicie o processo.'); return false }
    setCarregando(true); setErro('')
    const { data: ch, error: ce } = await supabase.auth.mfa.challenge({ factorId })
    if (ce) { setErro(ce.message); setCarregando(false); return false }
    const { error: ve } = await supabase.auth.mfa.verify({ factorId, challengeId: ch.id, code: codigo })
    if (ve) { setErro('Código inválido. Tente novamente.'); setCarregando(false); return false }
    setStatus('active')
    await buscarFatores()
    setCarregando(false)
    return true
  }, [factorId, supabase, buscarFatores])

  const desativarMFA = useCallback(async (fId: string) => {
    setCarregando(true); setErro('')
    const { error } = await supabase.auth.mfa.unenroll({ factorId: fId })
    if (error) { setErro(error.message); setCarregando(false); return false }
    setStatus('idle'); setFactors([]); setQrCode(''); setSecret(''); setFactorId('')
    setCarregando(false)
    return true
  }, [supabase])

  const cancelarEnroll = useCallback(async () => {
    if (factorId) await supabase.auth.mfa.unenroll({ factorId })
    setStatus('idle'); setQrCode(''); setSecret(''); setFactorId(''); setErro('')
  }, [factorId, supabase])

  return {
    status, qrCode, secret, factorId, factors, erro, carregando,
    buscarFatores, iniciarEnroll, verificarCodigo, desativarMFA, cancelarEnroll,
  }
}
