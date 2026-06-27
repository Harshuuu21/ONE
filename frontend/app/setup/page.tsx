import { SetupFlow } from '@/components/setup/setup-flow'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setup | ONE',
  description: 'Securely set up your financial intelligence and lending profile.',
}

export default function SetupPage() {
  return (
    <div className="grain min-h-[100svh] w-full overflow-hidden">
      <SetupFlow />
    </div>
  )
}
