import express from 'express'
import userRoutes from '../Controller/User.controller.js'

const router = express.Router()

const { deleteUser, getAllUsers, getUserById, updateUser, createUser } = userRoutes

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router;