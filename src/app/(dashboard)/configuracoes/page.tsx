import { createClient } from '@/lib/supabase-server'
import { User, Mail, Shield } from 'lucide-react'

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {/* Perfil */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-gray-400" />
            <h2 className="text-[14px] font-medium text-gray-900">Perfil</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1">Nome</label>
              <p className="text-[13px] text-gray-900">{user?.user_metadata?.full_name || '—'}</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1">E-mail</label>
              <p className="text-[13px] text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Plano */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-gray-400" />
            <h2 className="text-[14px] font-medium text-gray-900">Plano atual</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-[13px] font-medium text-gray-900">Plano Free</p>
              <p className="text-[12px] text-gray-400">1 veículo · Funcionalidades básicas</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade para Pro
            </button>
          </div>
        </div>

        {/* Conta */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={16} className="text-gray-400" />
            <h2 className="text-[14px] font-medium text-gray-900">Notificações</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Alertas de manutenção por e-mail', desc: 'Receba avisos quando uma revisão estiver próxima' },
              { label: 'Resumo mensal de gastos', desc: 'Relatório automático todo dia 1º do mês' },
            ].map(item => (
              <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 accent-blue-600" />
                <div>
                  <p className="text-[13px] font-medium text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-400">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
