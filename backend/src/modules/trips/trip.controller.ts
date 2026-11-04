import { Response, NextFunction } from 'express';
import { TripService } from './trip.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class TripController {
  static async listTrips(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const trips = await TripService.listUserTrips(req.user!.id);
      return sendSuccess(res, trips, 'Trips retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const trip = await TripService.createTrip(req.user!.id, req.body);
      return sendSuccess(res, trip, 'Trip created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const trip = await TripService.updateTrip(req.user!.id, req.params.id as string, req.body);
      return sendSuccess(res, trip, 'Trip updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await TripService.deleteTrip(req.user!.id, req.params.id as string);
      return sendSuccess(res, null, 'Trip deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
