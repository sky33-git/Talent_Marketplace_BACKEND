import express from 'express'
import { getAllClients, createClient,getClientById, updateClient, deleteClient } from '../Controller/Client.controller.js'

const router = express.Router()

router.get('/', getAllClients)
router.get('/:id', getClientById)
router.post('/', createClient)
router.put('/:id', updateClient)
router.delete('/:id', deleteClient)

export default router;