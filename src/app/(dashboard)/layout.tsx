import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userName  = user.user_metadata?.full_name ?? ''
  const userEmail = user.email ?? ''

  return (
    <DashboardLayout userName={userName} userEmail={userEmail}>
      {children}
    </DashboardLayout>
  )
}
