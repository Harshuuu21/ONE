import { randomUUID } from 'crypto';
import { GeneratedCommunity, GeneratedContribution, SimulatedMember, UserPersona } from '../demo-data.types.js';
import { round2, randomInRange, randomInt, shuffle, randomChoice } from '../utils/random.utils.js';
import { daysAgo } from '../utils/date.utils.js';

interface CommunityTemplate {
  name: string;
  category: string;
  description: string;
  adminName: string;
  sharedGoal: string;
  targetAmount: number;
}

const PERSONA_COMMUNITY_TEMPLATES: Record<UserPersona, CommunityTemplate[]> = {
  STUDENT: [
    {
      name: 'Campus Tech & Hackathon Pool',
      category: 'Education & Hardware',
      description: 'Peer group pooling funds for hardware prototyping components and travel to national hackathons.',
      adminName: 'Aarav Sharma',
      sharedGoal: 'Team Hardware Kits for SIH 2026',
      targetAmount: 75000,
    },
    {
      name: 'Student Travel & Adventure Syndicate',
      category: 'Travel',
      description: 'Monthly micro-savings circle for weekend treks and annual semester-end road trips.',
      adminName: 'Pooja Varma',
      sharedGoal: 'Himachal Backpacking Collective',
      targetAmount: 50000,
    },
    {
      name: 'Young Angel & Index Circle',
      category: 'Investing',
      description: 'Beginner investors sharing mutual fund strategies and pooling for paper-trading challenges.',
      adminName: 'Karan Malhotra',
      sharedGoal: 'Group Nifty Index Compounding Challenge',
      targetAmount: 100000,
    },
  ],
  WORKING_PROFESSIONAL: [
    {
      name: 'Bengaluru Tech Wealth Syndicate',
      category: 'Wealth Building',
      description: 'Senior engineers and product managers collaborating on tax harvesting, REITs, and emergency pools.',
      adminName: 'Vikram Sen',
      sharedGoal: 'Collective High-Yield Liquid Buffer',
      targetAmount: 500000,
    },
    {
      name: 'Future Homeowners Downpayment Circle',
      category: 'Real Estate',
      description: 'Accountability group keeping each other disciplined towards 20% downpayments for urban homes.',
      adminName: 'Neha Deshmukh',
      sharedGoal: 'Apartment Downpayment Milestone',
      targetAmount: 1200000,
    },
    {
      name: 'Global Nomads Travel Fund',
      category: 'Travel & Lifestyle',
      description: 'Curated circle pooling travel points, shared villa bookings, and curated off-site retreats.',
      adminName: 'Rohan Mehra',
      sharedGoal: 'Japan Autumn Collaborative Retreat',
      targetAmount: 400000,
    },
  ],
  FREELANCER: [
    {
      name: 'Independent Creators Safety Net',
      category: 'Micro-Insurance',
      description: 'Mutual aid reserve where members support each other through late client payment windows.',
      adminName: 'Ananya Nair',
      sharedGoal: 'Emergency Freelancer Liquidity Pool',
      targetAmount: 250000,
    },
    {
      name: 'Digital Nomads Shared Workspace Pot',
      category: 'Co-Working & Travel',
      description: 'Pooled credits for international coworking spaces and collective studio equipment rentals.',
      adminName: 'Kabir Das',
      sharedGoal: 'South-East Asia Co-Working Hub Pass',
      targetAmount: 180000,
    },
    {
      name: 'Designers & Solopreneurs Circle',
      category: 'Business Growth',
      description: 'Sharing software subscription group discounts and collective marketing test budgets.',
      adminName: 'Meera Pillai',
      sharedGoal: 'Design Asset Library & Font Licences',
      targetAmount: 120000,
    },
  ],
  BUSINESS_OWNER: [
    {
      name: 'SME Founders Working Capital Syndicate',
      category: 'Working Capital',
      description: 'Peer lending and inventory bridge financing circle for seasonal business demands.',
      adminName: 'Sanjay Goel',
      sharedGoal: 'Diwali Supplier Advance Bulk Pool',
      targetAmount: 2000000,
    },
    {
      name: 'Retailers Bulk Buying Alliance',
      category: 'Procurement',
      description: 'Local business owners combining volume purchase orders to negotiate 25% lower wholesale unit costs.',
      adminName: 'Rajesh Singhania',
      sharedGoal: 'Q3 Packaging & Logistics Collective Order',
      targetAmount: 1500000,
    },
    {
      name: 'Entrepreneurs Expansion Hub',
      category: 'Growth',
      description: 'Collaborative funding network supporting local franchise launches and store expansions.',
      adminName: 'Deepak Chawla',
      sharedGoal: 'Regional Distribution Expansion Fund',
      targetAmount: 3000000,
    },
  ],
};

const SIMULATED_MEMBER_NAMES = [
  'Aarav Sharma',
  'Pooja Varma',
  'Vikram Sen',
  'Neha Deshmukh',
  'Karan Malhotra',
  'Ananya Nair',
  'Kabir Das',
  'Meera Pillai',
  'Sanjay Goel',
  'Rohan Mehra',
  'Sneha Kulkarni',
  'Aditya Rao',
  'Tanvi Kapoor',
  'Ishaan Roy',
];

export function generateCommunities(
  userId: string,
  persona: UserPersona,
  count: number = 2
): GeneratedCommunity[] {
  const templates = PERSONA_COMMUNITY_TEMPLATES[persona] || PERSONA_COMMUNITY_TEMPLATES.WORKING_PROFESSIONAL;
  const selectedTemplates = shuffle(templates).slice(0, Math.min(count, templates.length));

  return selectedTemplates.map((template) => {
    const communityId = randomUUID();
    const memberCount = randomInt(8, 22);

    // Create 4-7 simulated member profile snapshots
    const memberNamePool = shuffle(SIMULATED_MEMBER_NAMES).slice(0, 6);
    const simulatedMembers: SimulatedMember[] = memberNamePool.map((name, index) => ({
      id: randomUUID(),
      name,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + index * 100}?w=150&auto=format&fit=crop&q=80`,
      role: index === 0 ? 'ADMIN' : index === 1 ? 'MODERATOR' : 'MEMBER',
      joinedAt: daysAgo(randomInt(30, 180)).toISOString(),
      totalContributed: round2(randomInRange(template.targetAmount * 0.05, template.targetAmount * 0.15, 0)),
    }));

    // Generate recent simulated contributions
    const contributionCount = randomInt(5, 10);
    const contributions: GeneratedContribution[] = [];
    let totalContributed = 0;

    for (let c = 0; c < contributionCount; c++) {
      const isUser = c === 1; // Exactly 1 contribution by current user to show participation
      const contributor = isUser
        ? { name: 'You' }
        : randomChoice(simulatedMembers);

      const contributionAmount = round2(
        randomInRange(template.targetAmount * 0.03, template.targetAmount * 0.08, 0)
      );

      contributions.push({
        id: randomUUID(),
        communityId,
        contributorName: contributor.name,
        isUserContribution: isUser,
        amount: contributionAmount,
        date: daysAgo(randomInt(1, 45)),
        note: isUser ? 'Monthly member pledge' : 'Automated circle debit',
        isDemo: true,
      });

      totalContributed = round2(totalContributed + contributionAmount);
    }

    // Sort contributions descending by date
    contributions.sort((a, b) => b.date.getTime() - a.date.getTime());

    const progress = round2(Math.min(95, (totalContributed / template.targetAmount) * 100));

    return {
      id: communityId,
      userId,
      name: template.name,
      description: template.description,
      category: template.category,
      adminName: template.adminName,
      memberCount,
      membersSnapshot: simulatedMembers,
      sharedGoal: template.sharedGoal,
      targetAmount: template.targetAmount,
      totalContributions: totalContributed,
      progress,
      isDemo: true,
      contributions,
    };
  });
}
