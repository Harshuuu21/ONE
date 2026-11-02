'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Send, Sparkles, UserCircle, Bot, ArrowRight, CornerDownLeft } from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'
import { SceneHeader } from '@/components/common/scene-header'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Good day! I'm ONE, your ambient financial partner. How can I assist you with your decisions today? You can ask about your goals, safe-to-spend limits, or upcoming trips.",
    timestamp: 'Just now',
  },
]

const QUICK_PROMPTS = [
  'How much can I safely spend on dining this weekend?',
  'Am I still on track for my Tokyo trip next spring?',
  'Can I afford to lend $200 in the community pool?',
  'Summarize my financial trajectory over the last 6 months',
]

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: 'Now',
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let replyContent = "I've reviewed your latest data. Your cash reserves are strong, you're currently 9% under your target burn rate, and your trajectory remains positive. Would you like me to model how this impacts your savings goals?"
      if (text.toLowerCase().includes('dining') || text.toLowerCase().includes('spend')) {
        replyContent = "Based on your recurring subscriptions and planned bills for this cycle, you have $185 in safe discretionary spend for dining this weekend without dipping into your emergency buffer."
      } else if (text.toLowerCase().includes('tokyo') || text.toLowerCase().includes('trip')) {
        replyContent = "You're 54% funded for Tokyo and currently 3 weeks ahead of schedule. At your current pace of $420/month, you'll hit your full $3,800 target by April with room for flight upgrades."
      } else if (text.toLowerCase().includes('lend') || text.toLowerCase().includes('community')) {
        replyContent = "Yes! You have sufficient liquidity, and backing Daniel's tool purchase ($170) would keep you well within your community allocation while earning 4 reputation points."
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyContent,
          timestamp: 'Just now',
        },
      ])
      setIsTyping(false)
    }, 900)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-w-4xl mx-auto pb-4">
      <SceneHeader
        eyebrow="Intelligence & Guidance"
        title="Ambient Advisor"
        subtitle="Context-aware financial reasoning tailored to your life."
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pt-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="mt-1">
                <OneOrb size={30} />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-3xl p-5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground font-medium rounded-br-sm'
                  : 'border border-border bg-card text-card-foreground shadow-sm rounded-tl-sm'
              }`}
            >
              <p>{msg.content}</p>
              <span className={`block mt-2 text-[10px] ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {msg.timestamp}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold mt-1">
                M
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <OneOrb size={26} />
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Prompt Suggestions */}
      {messages.length <= 2 && (
        <div className="py-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-card hover:bg-secondary/80 border border-border rounded-full px-3.5 py-1.5 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
            >
              <Sparkles className="size-3 text-primary" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ONE anything about your finances, plans, or trajectory..."
            className="w-full rounded-2xl border border-border bg-card pl-5 pr-14 py-4 text-sm outline-none focus:border-primary shadow-sm transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

