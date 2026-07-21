import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateJwt } from '../middlewares/authMiddleware';

const router = Router();
const taskController = new TaskController();

// Apply authentication middleware to all task routes
router.use(authenticateJwt);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/:id/run', taskController.runTask);
router.get('/:id/logs', taskController.getTaskLogs);
router.delete('/:id', taskController.deleteTask);

export default router;
