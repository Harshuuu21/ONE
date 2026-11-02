'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import {
  MessagesSquare,
  Sparkles,
  Target,
  Compass,
  Route,
  ArrowLeft,
  Search,
  Bell,
  Settings,
  Receipt,
  Calendar,
  BarChart,
  UserCircle,
  type LucideIcon,
} from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'
import type { PillarId } from '@/lib/one-data'
import { BriefingScene } from '@/app/(authenticated)/dashboard/components/briefing-scene'
import { GoalsScene } from '@/app/(authenticated)/goals/components/goals-scene'
import { ReputationScene } from '@/app/(authenticated)/settings/components/reputation-scene'
import { CommunityScene } from '@/app/(authenticated)/community/components/community-scene'
import { TripScene } from '@/app/(authenticated)/trips/components/trip-scene'
import { JourneyScene } from '@/app/(authenticated)/dashboard/components/journey-scene'
import { TransactionsScene } from '@/app/(authenticated)/savings/components/transactions-scene'
import { CalendarScene } from '@/app/(authenticated)/dashboard/components/calendar-scene'
import { ReportsScene } from '@/app/(authenticated)/dashboard/components/reports-scene'
import { LendingScene } from '@/app/(authenticated)/wallet/components/wallet-view'
import { AssistantBar } from './assistant-bar'
import { GlobalSearch } from './global-search'
import { NotificationsPanel } from './notifications-panel'
import { SettingsModal } from '@/app/(authenticated)/settings/components/settings-modal'

type NavItem = { id: PillarId; label: string; icon: LucideIcon }

const NAV: NavItem[] = [
  { id: 'briefing', label: 'Briefing', icon: Sparkles },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'trips', label: 'Trips', icon: Compass },
  { id: 'community', label: 'Community', icon: MessagesSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: BarChart },
  { id: 'journey', label: 'Journey', icon: Route },
  { id: 'profile', label: 'Profile', icon: UserCircle },
]

function MessagesSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  )
}

const SCENES: Record<PillarId, () => React.ReactNode> = {
  briefing: () => <BriefingScene />,
  transactions: () => <TransactionsScene />,
  goals: () => <GoalsScene />,
  profile: () => <ReputationScene />,
  community: () => <CommunityScene />,
  trips: () => <TripScene />,
  journey: () => <JourneyScene />,
  calendar: () => <CalendarScene />,
  reports: () => <ReportsScene />,
  lending: () => <LendingScene />,
}

export function OsShell() {
  const [scene, setScene] = useState<PillarId>('briefing')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
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
        <div className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
          <OneOrb size={22} />
          <span className="font-serif text-lg font-semibold tracking-tight">ONE</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="size-4" />
          </button>
          <button onClick={() => setNotificationsOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="size-4" />
          </button>
          <button onClick={() => setSettingsOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="size-4" />
          </button>
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground cursor-pointer">
            M
          </div>
        </div>
      </header>

      {/* scene */}
      <main className="relative mx-auto w-full max-w-5xl flex-1 px-5 pb-44 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
          >
            {SCENES[scene]()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ambient assistant + dock */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 px-4 pb-4">
        <AssistantBar scene={scene} onNavigate={setScene} />
        <nav className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/90 p-1.5 shadow-[0_20px_50px_-30px_rgba(40,60,45,0.5)] backdrop-blur-xl">
          {NAV.map((item) => {
            const Icon = item.icon
            const isActive = scene === item.id
            return (
              <button
                key={item.id}
                onClick={() => setScene(item.id)}
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
              </button>
            )
          })}
        </nav>
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
