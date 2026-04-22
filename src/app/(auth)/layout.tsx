import { Car } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Car size={16} className="text-white" />
        </div>
        <span className="font-semibold text-gray-900">AutoGest</span>
      </Link>
      {children}
    </div>
  )
}
