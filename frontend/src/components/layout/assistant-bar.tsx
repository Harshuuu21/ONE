'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, X } from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'
import type { PillarId } from '@/lib/one-data'

type Suggestion = { label: string; go: PillarId; reply: string }

const SUGGESTIONS: Suggestion[] = [
  {
    label: 'How am I doing this week?',
    go: 'briefing',
    reply:
      "You're 9% under your usual spend and your streak is at 6 weeks. I'd call this a strong week — want me to move the difference toward Japan?",
  },
  {
    label: 'Am I on track for Japan?',
    go: 'goals',
    reply:
      "Yes — you're 54% funded and actually 3 weeks ahead of schedule. At $420/month you'll hit your target by spring.",
  },
  {
    label: 'Can I help someone today?',
    go: 'lending',
    reply:
      'Daniel needs $170 more for tools on a new contract. His reputation is solid and his plan is realistic. A small amount goes a long way here.',
  },
  {
    label: 'Show me how far I’ve come',
    go: 'journey',
    reply:
      "Since 2023 your net worth grew 81% — from $21,200 to $38,400. More importantly, you've kept showing up. That's the real story.",
  },
]

export function AssistantBar({
  scene,
  onNavigate,
}: {
  scene: PillarId
  onNavigate: (id: PillarId) => void
}) {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [asked, setAsked] = useState<string | null>(null)

  function ask(s: Suggestion) {
    setAsked(s.label)
    setReply(null)
    onNavigate(s.go)
    setTimeout(() => setReply(s.reply), 450)
  }

  return (
    <motion.div layout className="w-full max-w-2xl">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mb-2 overflow-hidden rounded-3xl border border-border bg-card/95 p-4 shadow-[0_20px_60px_-30px_rgba(40,60,45,0.5)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <OneOrb size={32} thinking={asked !== null && reply === null} />
              <div className="min-h-[2.5rem] flex-1 pt-1">
                <AnimatePresence mode="wait">
                  {reply ? (
                    <motion.p
                      key="reply"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm leading-relaxed text-pretty"
                    >
                      {reply}
                    </motion.p>
                  ) : asked ? (
                    <motion.p
                      key="thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground"
                    >
                      Thinking through your numbers…
                    </motion.p>
                  ) : (
                    <motion.p
                      key="hello"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground"
                    >
                      Ask me anything about your money. I already know the context.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close assistant"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => ask(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-full border border-border bg-card/90 px-4 py-3 text-left shadow-[0_20px_50px_-30px_rgba(40,60,45,0.5)] backdrop-blur-xl transition-colors hover:border-primary/40"
      >
        <OneOrb size={26} />
        <span className="flex-1 text-sm text-muted-foreground">
          Ask ONE anything…
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ArrowUp className="size-4" />
        </span>
      </button>
    </motion.div>
  )
}
