'use client'

import { ArrowRight, Bell, Calendar, Smartphone } from 'lucide-react'

export function DevicePermissionsScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Optional Device Permissions
        </h2>
        <p className="text-muted-foreground text-lg">
          To give you timely nudges and reminders.
        </p>
      </div>

      <div className="bg-destructive/5 text-destructive rounded-2xl p-4 text-sm font-medium max-w-md mx-auto w-full text-center">
        NO SMS PERMISSION. NO EMAIL PARSING.
      </div>

      <div className="space-y-4 max-w-md mx-auto w-full">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-1">
            <Bell className="size-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">Notifications</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4 marker:text-border">
              <li>Bill reminders</li>
              <li>Goal reminders</li>
              <li>Loan reminders</li>
              <li>Budget alerts</li>
            </ul>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-1">
            <Calendar className="size-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">Calendar</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4 marker:text-border">
              <li>Goal scheduling</li>
              <li>Trip reminders</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col gap-3 items-center max-w-md mx-auto w-full">
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Enable Permissions
          <Smartphone className="size-4" />
        </button>
        <button
          onClick={onNext}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
