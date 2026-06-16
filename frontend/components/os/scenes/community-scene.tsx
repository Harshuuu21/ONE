'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { MessageCircle, Heart } from 'lucide-react'
import { conversations } from '@/lib/one-data'
import { SceneHeader } from '../scene-header'

const TOPICS = ['All', 'Mindset', 'Goals', 'Community', 'Trips', 'Debt']

export function CommunityScene() {
  return (
    <div>
      <SceneHeader
        eyebrow="Community knowledge"
        title="Money is emotional. People learn from people."
        subtitle="Real stories from people a few steps ahead of where you are. No gurus, no jargon — just lived experience."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TOPICS.map((t, i) => (
          <button
            key={t}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {conversations.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <Image
                src={c.avatar || '/placeholder.svg'}
                alt={c.author}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
                style={{ width: 40, height: 40 }}
              />
              <div>
                <p className="text-sm font-medium">{c.author}</p>
                <p className="text-xs text-muted-foreground">{c.reputationTitle}</p>
              </div>
              <span className="ml-auto rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                {c.topic}
              </span>
            </div>

            <h3 className="mt-4 font-serif text-xl font-medium leading-snug tracking-tight text-balance">
              {c.title}
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">{c.excerpt}</p>

            <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="size-4" />
                {c.replies} replies
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="size-4" />
                {c.helped} found this helpful
              </span>
              <span className="ml-auto font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Read story
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
