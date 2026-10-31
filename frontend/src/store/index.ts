import { useState, useEffect } from 'react'
import type { PillarId } from '@/lib/one-data'

export interface OsStoreState {
  activePillar: PillarId
  isSearchOpen: boolean
  isNotificationsOpen: boolean
  isSettingsOpen: boolean
  activeSettingsTab: string
}

const defaultState: OsStoreState = {
  activePillar: 'briefing',
  isSearchOpen: false,
  isNotificationsOpen: false,
  isSettingsOpen: false,
  activeSettingsTab: 'Account',
}

type Listener = (state: OsStoreState) => void

let currentState: OsStoreState = { ...defaultState }
const listeners = new Set<Listener>()

function emitChange() {
  for (const listener of listeners) {
    listener(currentState)
  }
}

export const osStore = {
  getState: () => currentState,
  setState: (updater: Partial<OsStoreState> | ((prev: OsStoreState) => Partial<OsStoreState>)) => {
    const next = typeof updater === 'function' ? updater(currentState) : updater
    currentState = { ...currentState, ...next }
    emitChange()
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  reset: () => {
    currentState = { ...defaultState }
    emitChange()
  },
}

export function useOsStore(): [OsStoreState, typeof osStore.setState] {
  const [state, setState] = useState<OsStoreState>(currentState)

  useEffect(() => {
    return osStore.subscribe(setState)
  }, [])

  return [state, osStore.setState]
}

