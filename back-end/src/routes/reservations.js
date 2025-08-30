import { Router } from 'express'
import { authRequired, currentUser, requireRole } from '../middleware/auth.js'
import * as reservationController from '../controllers/reservationController.js'

const router = Router()

router.post('/', reservationController.create)


router.get('/',    authRequired, currentUser, requireRole('admin','employe'), reservationController.list)
router.get('/:id', authRequired, currentUser, requireRole('admin','employe'), reservationController.detail)
router.patch('/:id', authRequired, currentUser, requireRole('admin','employe'), reservationController.update)
router.delete('/:id', authRequired, currentUser, requireRole('admin','employe'), reservationController.remove)

export default router
