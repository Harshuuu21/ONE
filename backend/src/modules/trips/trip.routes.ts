import { Router } from 'express';
import { TripController } from './trip.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createTripSchema, updateTripSchema } from './trip.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', TripController.listTrips);
router.post('/', validateRequest(createTripSchema), TripController.createTrip);
router.patch('/:id', validateRequest(updateTripSchema), TripController.updateTrip);
router.delete('/:id', TripController.deleteTrip);

export default router;

