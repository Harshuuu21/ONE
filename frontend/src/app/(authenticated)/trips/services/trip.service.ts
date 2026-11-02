import { trip } from '@/lib/one-data';
import type { Trip } from '../types';

export class TripService {
  static getCurrentTrip(): Trip {
    return trip;
  }
}

