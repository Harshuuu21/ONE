// Simulated data layer for the ONE Financial Operating System.
// Everything is mock data designed to feel real, emotional, and motivating.

export const user = {
  name: 'Maya',
  firstName: 'Maya',
  joinedYear: 2023,
  reputationTitle: 'Steady Builder',
  reputationScore: 824,
}

export type Insight = {
  id: string
  kind: 'opportunity' | 'caution' | 'win' | 'nudge'
  title: string
  body: string
  action: string
}

// --- 1. AI Financial Intelligence: the daily briefing ---------------------
export const briefing = {
  greeting: 'Good morning, Maya.',
  headline:
    'You are ahead of where you were last month. Today is a good day to move money toward what matters.',
  summary:
    'Spending settled 9% below your usual pace this week, and your Japan fund crossed the halfway mark. I noticed one subscription you may have forgotten.',
  safeToSpend: 1280,
  safeToSpendNote: 'after bills, goals and a small buffer',
  momentum: 0.78,
}

export const insights: Insight[] = [
  {
    id: 'i1',
    kind: 'opportunity',
    title: 'Move $200 to your Japan trip',
    body: 'You spent less on dining this week. Redirecting the difference keeps your trip 3 weeks ahead of schedule.',
    action: 'Move $200',
  },
  {
    id: 'i2',
    kind: 'caution',
    title: 'A subscription you forgot',
    body: 'Aurora Cloud charged $14.99 again. You have not opened it in 4 months. Want me to flag it?',
    action: 'Review it',
  },
  {
    id: 'i3',
    kind: 'win',
    title: '6 weeks of consistent saving',
    body: 'You have saved something every week since April. That streak is doing more than any single big deposit.',
    action: 'See streak',
  },
]

// --- 2. Life Goals ---------------------------------------------------------
export type Goal = {
  id: string
  title: string
  emoji?: string
  image: string
  saved: number
  target: number
  monthly: number
  etaMonths: number
  tone: string
}

export const goals: Goal[] = [
  {
    id: 'japan',
    title: 'Two weeks in Japan',
    image: '/goal-japan.png',
    saved: 4200,
    target: 7800,
    monthly: 420,
    etaMonths: 9,
    tone: 'Spring cherry blossoms in Kyoto',
  },
  {
    id: 'emergency',
    title: 'Peace of mind fund',
    image: '/goal-emergency.png',
    saved: 9100,
    target: 12000,
    monthly: 350,
    etaMonths: 8,
    tone: 'Six months of breathing room',
  },
  {
    id: 'studio',
    title: 'Home studio',
    image: '/goal-studio.png',
    saved: 1450,
    target: 5200,
    monthly: 180,
    etaMonths: 21,
    tone: 'A room to make things in',
  },
  {
    id: 'business',
    title: 'Launch the side studio',
    image: '/goal-business.png',
    saved: 2600,
    target: 10000,
    monthly: 300,
    etaMonths: 25,
    tone: 'The first real step toward independence',
  },
]

// --- 3. Financial Reputation ----------------------------------------------
export const reputation = {
  score: 824,
  max: 1000,
  title: 'Steady Builder',
  percentile: 'Top 12% of your community',
  facets: [
    { label: 'Consistency', value: 92, note: '38 weeks of regular saving' },
    { label: 'Reliability', value: 88, note: 'Every shared loan repaid on time' },
    { label: 'Growth', value: 74, note: 'Net worth up 18% this year' },
    { label: 'Resilience', value: 81, note: 'Buffer survived 2 surprises' },
  ],
  milestones: [
    { id: 'm1', title: 'First Goal Funded', unlocked: true },
    { id: 'm2', title: 'Trusted Lender', unlocked: true },
    { id: 'm3', title: 'Half-Year Streak', unlocked: true },
    { id: 'm4', title: 'Community Pillar', unlocked: false },
  ],
}

// --- 4. Community Lending --------------------------------------------------
export type LendingRequest = {
  id: string
  name: string
  avatar: string
  reputation: number
  reputationTitle: string
  amount: number
  funded: number
  reason: string
  story: string
  termMonths: number
  backers: number
}

export const lendingRequests: LendingRequest[] = [
  {
    id: 'l1',
    name: 'Daniel R.',
    avatar: '/person-daniel.png',
    reputation: 791,
    reputationTitle: 'Reliable',
    amount: 600,
    funded: 430,
    reason: 'Tools for a new contract',
    story:
      'A small carpentry contract came through but I need to buy tools up front. I can repay over 4 months once the first invoice clears.',
    termMonths: 4,
    backers: 7,
  },
  {
    id: 'l2',
    name: 'Priya S.',
    avatar: '/person-priya.png',
    reputation: 868,
    reputationTitle: 'Trusted Lender',
    amount: 350,
    funded: 120,
    reason: 'Certification exam fee',
    story:
      'One exam stands between me and a nursing certification that raises my income. Repaying in 3 months after the pay bump.',
    termMonths: 3,
    backers: 3,
  },
]

export const lendingYou = {
  trustCircle: 14,
  activelyBacking: 3,
  totalBacked: 1450,
  onTimeRate: 100,
}

// --- 5. Community Knowledge ------------------------------------------------
export type Conversation = {
  id: string
  author: string
  avatar: string
  reputationTitle: string
  topic: string
  title: string
  excerpt: string
  replies: number
  helped: number
}

export const conversations: Conversation[] = [
  {
    id: 'c1',
    author: 'Lena M.',
    avatar: '/person-lena.png',
    reputationTitle: 'Mentor',
    topic: 'Mindset',
    title: 'How I stopped feeling guilt every time I spent money',
    excerpt:
      'Naming a “joy budget” changed everything. Permission to spend on the right things made me better at saving on the rest.',
    replies: 48,
    helped: 213,
  },
  {
    id: 'c2',
    author: 'Theo K.',
    avatar: '/person-theo.png',
    reputationTitle: 'Steady Builder',
    topic: 'Goals',
    title: 'Funding a trip without going into debt — my exact method',
    excerpt:
      'I split every goal into a weekly number so tiny it felt silly. Nine months later I was standing in Lisbon.',
    replies: 31,
    helped: 167,
  },
  {
    id: 'c3',
    author: 'Amara O.',
    avatar: '/person-amara.png',
    reputationTitle: 'Trusted Lender',
    topic: 'Community',
    title: 'Backing a stranger taught me more than any finance book',
    excerpt:
      'Watching someone repay a loan I helped fund rebuilt my faith in people and in money as a tool for good.',
    replies: 26,
    helped: 142,
  },
]

// --- 6. Trip Intelligence --------------------------------------------------
export const trip = {
  destination: 'Japan',
  image: '/goal-japan.png',
  dates: 'Apr 2 – Apr 16',
  days: 14,
  budget: 7800,
  saved: 4200,
  spent: 1250, // Added for active tracking
  travelers: 2,
  status: 'funding', // 'planning', 'funding', 'active', 'completed'
  budgetTier: 'mid-range',
  weather: { temp: 18, condition: 'Clear Sky' },
  breakdown: [
    { label: 'Flights', planned: 2400, spent: 2400, tone: 'Booked early — you saved $310' },
    { label: 'Stays', planned: 2100, spent: 0, tone: '12 nights across Tokyo & Kyoto' },
    { label: 'Food', planned: 1400, spent: 0, tone: 'About $50/day each' },
    { label: 'Trains & transit', planned: 900, spent: 0, tone: 'JR Pass included' },
    { label: 'Experiences', planned: 1000, spent: 0, tone: 'Room for the unplanned' },
  ],
  itinerary: [
    { day: 1, title: 'Arrival in Tokyo', activities: ['Settle into Shinjuku hotel', 'Evening walk through Omoide Yokocho', 'Dinner at Ichiran Ramen'] },
    { day: 2, title: 'Classic Tokyo', activities: ['Senso-ji Temple early morning', 'Ueno Park', 'Akihabara electronics & anime culture'] },
    { day: 3, title: 'Modern Tokyo', activities: ['Shibuya Crossing', 'Meiji Shrine', 'Harajuku shopping', 'Evening at Roppongi'] },
  ],
  communities: [
    { name: 'Japan Travel Tips', members: 1402, type: 'public' },
    { name: 'Smart Backpackers', members: 890, type: 'public' }
  ],
  intelligence:
    'If you book the Kyoto leg before March 1, prices historically rise 22% after. I am watching three flight routes for you.',
}

// --- 7. Financial Journey --------------------------------------------------
export const journey = {
  netWorthNow: 38400,
  netWorthStart: 21200,
  startYear: 2023,
  points: [
    { label: '2023', value: 21200 },
    { label: 'Q1', value: 23800 },
    { label: 'Q2', value: 26100 },
    { label: 'Q3', value: 28900 },
    { label: 'Q4', value: 31500 },
    { label: 'Now', value: 38400 },
  ],
  milestones: [
    { year: '2023', title: 'Opened ONE', note: 'Started with a single goal and a lot of doubt.' },
    { year: '2024', title: 'First $10k saved', note: 'The moment saving started to feel real.' },
    { year: '2024', title: 'Became a Trusted Lender', note: 'Backed three people. All repaid.' },
    { year: '2025', title: 'Funded a dream', note: 'Booked the trip you almost cancelled twice.' },
  ],
}

export const pillars = [
  {
    id: 'briefing',
    name: 'Intelligence',
    label: 'AI Briefing',
    line: 'Understands what happened, why, and what to do next.',
  },
  { id: 'goals', name: 'Goals', label: 'Life Goals', line: 'Save for dreams, not balances.' },
  {
    id: 'reputation',
    name: 'Reputation',
    label: 'Financial Reputation',
    line: 'A new kind of identity built on trust and consistency.',
  },
  {
    id: 'lending',
    name: 'Lending',
    label: 'Community Lending',
    line: 'Support real people. Earn real credibility.',
  },
  {
    id: 'community',
    name: 'Community',
    label: 'Knowledge',
    line: 'Learn money from people who lived it.',
  },
  {
    id: 'trips',
    name: 'Trips',
    label: 'Trip Intelligence',
    line: 'Make travel exciting instead of restrictive.',
  },
  {
    id: 'journey',
    name: 'Journey',
    label: 'Financial Journey',
    line: 'See your past, present, and future as one story.',
  },
] as const

export type PillarId = (typeof pillars)[number]['id']

export function currency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
