import express from 'express'
import { deleteUser, getAllUsers, getUserById, updateUser, createUser, userCheck } from '../Controller/User.controller.js'
import { authenticate, authorize } from '../Middleware/Auth.Middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(authorize('user'))

router.get('/check', userCheck)
router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router;
