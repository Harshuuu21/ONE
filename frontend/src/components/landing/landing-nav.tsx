'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { OneWordmark } from '@/components/one-mark'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <div
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? 'border border-border/70 bg-background/80 shadow-sm backdrop-blur-xl'
            : 'border border-transparent'
        }`}
      >
        <Link href="/" aria-label="ONE home">
          <OneWordmark />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#belief" className="transition-colors hover:text-foreground">
            Belief
          </a>
          <a href="#intelligence" className="transition-colors hover:text-foreground">
            Intelligence
          </a>
          <a href="#pillars" className="transition-colors hover:text-foreground">
            The seven pillars
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log In
          </Link>
          <Link
            href="/setup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            Set up ONE
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
