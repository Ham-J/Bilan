import { Router } from 'express'
import { authRequired, requireRole } from '../middleware/auth.js'
import * as userController from '../controllers/userController.js'

const router = Router()
router.use(authRequired, requireRole('admin'))

router.get('/', userController.listUsers)
router.get('/:id', userController.getUser)
router.post('/', userController.createUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router
