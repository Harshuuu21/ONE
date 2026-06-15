'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'

const communitiesList = [
  'Students',
  'Entrepreneurs',
  'Travelers',
  'Freelancers',
  'Investors',
  'Creators',
  'Professionals'
]

interface CommunitiesScreenProps {
  onNext: (selected: string[]) => void
}

export function CommunitiesScreen({ onNext }: CommunitiesScreenProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleCommunity = (community: string) => {
    setSelected(prev => 
      prev.includes(community) 
        ? prev.filter(c => c !== community)
        : [...prev, community]
    )
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Connect with others</h2>
        <p className="mt-3 text-muted-foreground">Which communities interest you most?</p>
      </motion.div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
        {communitiesList.map((community, i) => {
          const isSelected = selected.includes(community)
          return (
            <motion.button
              key={community}
              onClick={() => toggleCommunity(community)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
              className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-all active:scale-95 ${
                isSelected 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <span>{community}</span>
              {isSelected && <Check className="size-3.5" />}
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 flex justify-center"
      >
        <button
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          Continue
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )
}
