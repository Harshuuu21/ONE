import { redirect } from 'next/navigation';

/**
 * Occupation-based personalization system has been removed.
 * Users proceed directly to the financial dashboard with automatic synthetic spending data.
 */
export default function OnboardingPage() {
  redirect('/dashboard');
}
