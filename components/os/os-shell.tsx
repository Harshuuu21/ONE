'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import {
  Sparkles,
  Target,
  ShieldCheck,
  HandHeart,
  MessagesSquare,
  Compass,
  Route,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react'
import { OneOrb } from '@/components/one-mark'
import type { PillarId } from '@/lib/one-data'
import { BriefingScene } from './scenes/briefing-scene'
import { GoalsScene } from './scenes/goals-scene'
import { ReputationScene } from './scenes/reputation-scene'
import { LendingScene } from './scenes/lending-scene'
import { CommunityScene } from './scenes/community-scene'
import { TripScene } from './scenes/trip-scene'
import { JourneyScene } from './scenes/journey-scene'
import { AssistantBar } from './assistant-bar'

type NavItem = { id: PillarId; label: string; icon: LucideIcon }

const NAV: NavItem[] = [
  { id: 'briefing', label: 'Briefing', icon: Sparkles },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'reputation', label: 'Reputation', icon: ShieldCheck },
  { id: 'lending', label: 'Lending', icon: HandHeart },
  { id: 'community', label: 'Community', icon: MessagesSquare },
  { id: 'trips', label: 'Trips', icon: Compass },
  { id: 'journey', label: 'Journey', icon: Route },
]

const SCENES: Record<PillarId, () => React.ReactNode> = {
  briefing: () => <BriefingScene />,
  goals: () => <GoalsScene />,
  reputation: () => <ReputationScene />,
  lending: () => <LendingScene />,
  community: () => <CommunityScene />,
  trips: () => <TripScene />,
  journey: () => <JourneyScene />,
}

export function OsShell() {
  const [scene, setScene] = useState<PillarId>('briefing')

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
        <div className="flex items-center gap-2.5">
          <OneOrb size={22} />
          <span className="font-serif text-lg font-semibold tracking-tight">ONE</span>
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
          M
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
    </div>
  )
}
