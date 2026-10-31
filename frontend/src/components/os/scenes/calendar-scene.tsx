'use client'

import { motion } from 'motion/react'
import { calendarEvents } from '@/lib/one-data'
import { SceneHeader } from '../scene-header'
import { Calendar, Bell, Plane, Target } from 'lucide-react'

const ICON_MAP = {
  deadline: Bell,
  trip: Plane,
  reminder: Bell,
  milestone: Target,
}

const COLOR_MAP = {
  deadline: 'bg-destructive/10 text-destructive',
  trip: 'bg-primary/10 text-primary',
  reminder: 'bg-secondary text-secondary-foreground',
  milestone: 'bg-gold/20 text-gold-foreground',
}

export function CalendarScene() {
  return (
    <div>
      <SceneHeader
        eyebrow="Financial Calendar"
        title="Your timeline, visualized."
        subtitle="Keep track of your financial milestones, upcoming trips, and important deadlines."
      />

      <div className="grid gap-3">
        {calendarEvents.map((ev, i) => {
          const Icon = ICON_MAP[ev.type]
          const colors = COLOR_MAP[ev.type]
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className={`flex size-10 items-center justify-center rounded-full ${colors}`}>
                <Icon className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{ev.title}</p>
                <p className="text-sm text-muted-foreground capitalize">{ev.type}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="size-4 text-muted-foreground" />
                  {ev.date}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
