'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Sparkles,
  Target,
  HandHeart,
  MessagesSquare,
  Compass,
  ArrowLeft,
  Search,
  Bell,
  Settings,
  Receipt,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { AssistantBar } from '@/components/layout/assistant-bar'
import { GlobalSearch } from '@/components/layout/global-search'
import { NotificationsPanel } from '@/components/layout/notifications-panel'
import { SettingsModal } from '@/app/(authenticated)/settings/components/settings-modal'
import type { PillarId } from '@/lib/one-data'

type NavItem = {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Briefing', icon: Sparkles, href: '/dashboard' },
  { id: 'goals', label: 'Goals', icon: Target, href: '/goals' },
  { id: 'savings', label: 'Savings', icon: Receipt, href: '/savings' },
  { id: 'trips', label: 'Trips', icon: Compass, href: '/trips' },
  { id: 'community', label: 'Community', icon: MessagesSquare, href: '/community' },
  { id: 'wallet', label: 'Wallet', icon: HandHeart, href: '/wallet' },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare, href: '/chat' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Map route to pillar ID for ambient assistant context
  const getPillarFromPath = (): PillarId => {
    if (pathname.includes('/goals')) return 'goals'
    if (pathname.includes('/trips')) return 'trips'
    if (pathname.includes('/community')) return 'community'
    if (pathname.includes('/wallet')) return 'lending'
    if (pathname.includes('/savings')) return 'transactions'
    if (pathname.includes('/settings')) return 'profile'
    return 'briefing'
  }

  const handlePillarNavigate = (pillar: PillarId) => {
    switch (pillar) {
      case 'goals':
        router.push('/goals')
        break
      case 'trips':
        router.push('/trips')
        break
      case 'community':
        router.push('/community')
        break
      case 'lending':
        router.push('/wallet')
        break
      case 'transactions':
        router.push('/savings')
        break
      case 'profile':
        router.push('/settings')
        break
      case 'briefing':
      default:
        router.push('/dashboard')
        break
    }
  }

  return (
    <ProtectedRoute>
      <div className="grain relative flex min-h-[100svh] flex-col bg-background">
        {/* top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/80 px-5 py-3 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Exit</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <OneOrb size={22} />
            <span className="font-serif text-lg font-semibold tracking-tight">ONE</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
            <button
              onClick={() => setNotificationsOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Settings"
            >
              <Settings className="size-4" />
            </button>
            <Link
              href="/settings"
              className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            >
              M
            </Link>
          </div>
        </header>

        {/* scene content */}
        <main className="relative mx-auto w-full max-w-5xl flex-1 px-5 pb-44 pt-6">
          {children}
        </main>

        {/* ambient assistant + dock */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 px-4 pb-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-2xl flex flex-col items-center">
            <AssistantBar scene={getPillarFromPath()} onNavigate={handlePillarNavigate} />
            <nav className="mt-3 flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/90 p-1.5 shadow-[0_20px_50px_-30px_rgba(40,60,45,0.5)] backdrop-blur-xl">
              {NAV.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dock-active"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="relative size-4" />
                    <span className="relative hidden sm:inline">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </ProtectedRoute>
  )
}
