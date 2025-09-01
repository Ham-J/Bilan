import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { list, create, update, remove } from '../controllers/reservationController.js';

const router = Router();

router.get('/', authRequired, requireRole('employe', 'admin'), list);
router.post('/', create);
router.patch('/:id', authRequired, requireRole('employe', 'admin'), update);
router.delete('/:id', authRequired, requireRole('employe', 'admin'), remove);

export default router;
