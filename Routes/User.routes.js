import express from 'express'
import { deleteUser, getAllUsers, getUserById, updateUser, createUser } from '../Controller/User.controller.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router;