'use client';

import { useState } from 'react';
import { GoalsService } from '../services/goals.service';
import type { Goal } from '../types';

export function useGoals() {
  const [goalList, setGoalList] = useState<Goal[]>(GoalsService.getGoals());
  const [modalOpen, setModalOpen] = useState(false);

  return {
    goals: goalList,
    setGoals: setGoalList,
    modalOpen,
    setModalOpen,
  };
}

