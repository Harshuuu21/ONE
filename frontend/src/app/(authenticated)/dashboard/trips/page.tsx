import { redirect } from 'next/navigation';

export default function DashboardTripsRedirect() {
  redirect('/trips');
}
