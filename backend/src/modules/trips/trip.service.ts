import { prisma } from '../../config/database.js';
import { CreateTripInput, UpdateTripInput } from './trip.schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

export class TripService {
  static async listUserTrips(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createTrip(userId: string, input: CreateTripInput) {
    return prisma.trip.create({
      data: {
        userId,
        destination: input.destination,
        budget: input.budget,
        spent: input.spent,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        travelersCount: input.travelersCount,
      },
    });
  }

  static async updateTrip(userId: string, tripId: string, input: UpdateTripInput) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    return prisma.trip.update({
      where: { id: tripId },
      data: {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      },
    });
  }

  static async deleteTrip(userId: string, tripId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    return prisma.trip.delete({
      where: { id: tripId },
    });
  }
}

