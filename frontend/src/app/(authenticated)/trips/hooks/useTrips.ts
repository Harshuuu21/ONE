'use client';

import { useState } from 'react';
import { TripService } from '../services/trip.service';
import type { Trip, TripTab } from '../types';

export function useTrips() {
  const [activeTab, setActiveTab] = useState<TripTab>('planning');
  const [currentTrip] = useState<Trip>(TripService.getCurrentTrip());

  return {
    activeTab,
    setActiveTab,
    trip: currentTrip,
  };
}

