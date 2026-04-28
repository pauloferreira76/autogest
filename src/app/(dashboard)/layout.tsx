import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar  from '@/components/dashboard/Topbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const userName  = user.user_metadata?.full_name ?? ''
  const userEmail = user.email ?? ''

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar userName={userName} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
