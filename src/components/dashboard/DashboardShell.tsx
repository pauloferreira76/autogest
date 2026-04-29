'use client'
import { useState } from 'react'
import Sidebar   from '@/components/dashboard/Sidebar'
import Topbar    from '@/components/dashboard/Topbar'
import BottomNav from '@/components/dashboard/BottomNav'

type Props = {
  children: React.ReactNode
  userName: string
  userEmail: string
}

export default function DashboardShell({ children, userName, userEmail }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Topbar
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="main-content">
          {children}
        </main>
      </div>

      <BottomNav />
    </>
  )
}
