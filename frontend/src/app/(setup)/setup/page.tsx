import { SetupFlow } from '@/features/setup/components/setup-flow'

export default function SetupPage() {
  return (
    <div className="grain min-h-[100svh] bg-background">
      <div className="mx-auto max-w-xl px-5 py-12">
        <SetupFlow />
      </div>
    </div>
  )
}
