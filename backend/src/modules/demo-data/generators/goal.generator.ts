import { randomUUID } from 'crypto';
import { GeneratedGoal, UserPersona } from '../demo-data.types.js';
import { round2, randomInRange, randomInt, shuffle } from '../utils/random.utils.js';
import { monthsAhead } from '../utils/date.utils.js';

interface GoalTemplate {
  title: string;
  description: string;
  category: string;
  minTarget: number;
  maxTarget: number;
  monthsToDeadline: number;
}

const PERSONA_GOAL_TEMPLATES: Record<UserPersona, GoalTemplate[]> = {
  STUDENT: [
    {
      title: 'M3 MacBook Air for Coding',
      description: 'Dedicated fund for new machine for computer science projects and hackathons',
      category: 'Electronics',
      minTarget: 80000,
      maxTarget: 115000,
      monthsToDeadline: 6,
    },
    {
      title: 'Semester Emergency Reserve',
      description: 'Buffer for unexpected exam fees, medical bills, and campus hostel expenses',
      category: 'Emergency',
      minTarget: 25000,
      maxTarget: 40000,
      monthsToDeadline: 4,
    },
    {
      title: 'Goa Graduation Road Trip',
      description: 'Shared travel pot with hostel batchmates after final exams',
      category: 'Travel',
      minTarget: 18000,
      maxTarget: 30000,
      monthsToDeadline: 8,
    },
    {
      title: 'AWS & Cloud Certification Exams',
      description: 'Exam vouchers and prep resources for Solutions Architect credential',
      category: 'Education',
      minTarget: 15000,
      maxTarget: 25000,
      monthsToDeadline: 3,
    },
  ],
  WORKING_PROFESSIONAL: [
    {
      title: '6-Month Runway Emergency Fund',
      description: 'High-yield liquid savings covering 6 months of mandatory fixed living costs',
      category: 'Emergency',
      minTarget: 300000,
      maxTarget: 600000,
      monthsToDeadline: 12,
    },
    {
      title: 'Tokyo & Kyoto Autumn Holiday',
      description: 'Flights, bullet train passes, and boutique hotel stays across Japan',
      category: 'Travel',
      minTarget: 200000,
      maxTarget: 350000,
      monthsToDeadline: 9,
    },
    {
      title: 'Electric Vehicle Downpayment',
      description: 'Initial deposit for a Nexon EV to reduce daily commute fuel spend',
      category: 'Vehicle',
      minTarget: 250000,
      maxTarget: 450000,
      monthsToDeadline: 14,
    },
    {
      title: 'Annual Index Fund Lump Sum',
      description: 'Year-end compounding contribution towards Nifty 50 and S&P 500 index funds',
      category: 'Investment',
      minTarget: 150000,
      maxTarget: 300000,
      monthsToDeadline: 5,
    },
  ],
  FREELANCER: [
    {
      title: '4K Studio Camera & Lighting Rig',
      description: 'Professional cinema camera body and continuous LED lighting for client shoots',
      category: 'Equipment',
      minTarget: 120000,
      maxTarget: 220000,
      monthsToDeadline: 6,
    },
    {
      title: 'Freelance Tax & GST Reserve 2026',
      description: 'Segregated advance tax withholding to avoid penalty interest',
      category: 'Taxes',
      minTarget: 90000,
      maxTarget: 180000,
      monthsToDeadline: 5,
    },
    {
      title: 'Quiet Season Cash Buffer',
      description: 'Buffer to comfortably ride out slower winter client contracting cycles',
      category: 'Emergency',
      minTarget: 150000,
      maxTarget: 300000,
      monthsToDeadline: 10,
    },
    {
      title: 'Bali Remote Co-Working Retreat',
      description: 'One month digital nomad workation in Canggu with dedicated fiber optic desk',
      category: 'Travel',
      minTarget: 80000,
      maxTarget: 140000,
      monthsToDeadline: 7,
    },
  ],
  BUSINESS_OWNER: [
    {
      title: 'Festive Season Inventory Expansion',
      description: 'Advance wholesale supplier orders for upcoming peak Diwali sales surge',
      category: 'Business',
      minTarget: 500000,
      maxTarget: 1200000,
      monthsToDeadline: 8,
    },
    {
      title: 'Commercial Office Space Renovation',
      description: 'Modern ergonomic desks and soundproof meeting pods for the team',
      category: 'Infrastructure',
      minTarget: 350000,
      maxTarget: 700000,
      monthsToDeadline: 11,
    },
    {
      title: '3-Month Payroll Safety Reserve',
      description: 'Dedicated business liquidity reserve to guarantee uninterrupted salaries',
      category: 'Emergency',
      minTarget: 800000,
      maxTarget: 1800000,
      monthsToDeadline: 15,
    },
    {
      title: 'Automated CRM & Enterprise Software',
      description: 'Annual enterprise licenses for sales automation and ERP cloud deployment',
      category: 'Software',
      minTarget: 180000,
      maxTarget: 320000,
      monthsToDeadline: 4,
    },
  ],
};

export function generateGoals(userId: string, persona: UserPersona, count: number = 3): GeneratedGoal[] {
  const templates = PERSONA_GOAL_TEMPLATES[persona] || PERSONA_GOAL_TEMPLATES.WORKING_PROFESSIONAL;
  const selectedTemplates = shuffle(templates).slice(0, Math.min(count, templates.length));

  return selectedTemplates.map((template) => {
    const targetAmount = round2(randomInRange(template.minTarget, template.maxTarget, 0));
    // Progress between 25% and 85%
    const progressFraction = randomInRange(0.25, 0.85, 2);
    const currentAmount = round2(targetAmount * progressFraction);
    const progressPercentage = round2((currentAmount / targetAmount) * 100);
    const deadline = monthsAhead(template.monthsToDeadline + randomInt(0, 3));

    return {
      id: randomUUID(),
      userId,
      title: template.title,
      description: template.description,
      targetAmount,
      currentAmount,
      category: template.category,
      deadline,
      status: progressPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
      progressPercentage,
      isDemo: true,
    };
  });
}

