import mongoose from 'mongoose'
import express from 'express'
import Client from '../Model/Client.model.js';

const router = express.Router()

router.post('/:clientId/client-details', async (req, res) => {
    const { clientId } = req.params;

    try {
        const clientEntry = {
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        }

        const client = await Client.findOneAndUpdate(
            { clientId: parseInt(clientId) },
            { $push: { clientDetails: clientEntry } },
            { new: true }
        )

        if (!client) return res.status(404).json({ message: 'client not found' })

        res.status(201).json({ message: 'Details added', clientEntry })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:clientId/client-details/:detailsId', async (req, res) => {
    const { clientId, detailsId } = req.params

    if (!mongoose.Types.ObjectId.isValid(detailsId)) {
        return res.status(400).json({ message: 'Invalid details ID' })
    }

    try {
        const client = await Client.findOneAndUpdate(
            { clientId: parseInt(clientId), 'details._id': clientId },
            {
                $set: {
                    'clientDetails.$': {
                        ...req.body,
                        _id: clientId
                    }
                }
            },
            { new: true }
        )

        if (!client) return res.status(404).json({ message: 'Client or details entry not found' })

        const updatedDetails = client.clientDetails.find(ele => ele._id.toString() === detailsId)

        res.json({ message: 'Client Details updated successfully', updatedDetails })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:clientId/client-details/:detailsId', async (req, res) => {
    const { clientId, detailsId } = req.params;

    try {
        const client = await Client.findOneAndUpdate(
            { clientId: parseInt(clientId) },
            { $pull: { clientDetails: { _id: detailsId } } },
            { new: true }
        )

        if (!client) return res.status(404).json({ message: 'Client or details not found' })

        res.json({ message: 'Client Details deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router

