import mongoose from 'mongoose'
import express from 'express'
import User from '../Model/User.model.js'

const router = express.Router()

// POST - Add a new training entry
router.post('/:userId/training', async (req, res) => {
    const { userId } = req.params;

    try {
        const trainingEntry = {
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        }

        const user = await User.findOneAndUpdate(
            { userId: parseInt(userId) },
            { $push: { training: trainingEntry } },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: 'User not found' })

        res.status(201).json({ message: 'Training added', trainingEntry })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT - Update a specific training entry
router.put('/:userId/training/:trainingId', async (req, res) => {
    const { userId, trainingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(400).json({ message: 'Invalid training ID' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { userId: parseInt(userId), 'training._id': trainingId },
            {
                $set: {
                    'training.$': {
                        ...req.body,
                        _id: trainingId
                    }
                }
            },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: 'User or training entry not found' });

        const updatedTraining = user.training.find(t => t._id.toString() === trainingId);

        res.json({ message: 'Training updated successfully', updatedTraining });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// DELETE - Remove a specific training entry
router.delete('/:userId/training/:trainingId', async (req, res) => {
    const { userId, trainingId } = req.params;

    try {
        const user = await User.findOneAndUpdate(
            { userId: parseInt(userId) },
            { $pull: { training: { _id: trainingId } } },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: 'User or training not found' });

        res.json({ message: 'Training deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router;
