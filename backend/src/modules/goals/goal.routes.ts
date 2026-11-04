import { Router } from 'express';
import { GoalController } from './goal.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createGoalSchema, updateGoalSchema } from './goal.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', GoalController.listGoals);
router.post('/', validateRequest(createGoalSchema), GoalController.createGoal);
router.patch('/:id', validateRequest(updateGoalSchema), GoalController.updateGoal);
router.delete('/:id', GoalController.deleteGoal);

export default router;

