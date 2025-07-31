import mongoose from 'mongoose'
import express from 'express'
import User from '../Model/User.model.js';

const router = express.Router()

router.post('/:userId/education', async (req, res) => {
    const { userId } = req.params;

    try {
        const educationEntry = {
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        }

        const user = await User.findOneAndUpdate(
            { userId: parseInt(userId) },
            { $push: { education: educationEntry } },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: 'User not found' })

        res.status(201).json({ message: 'Education added', educationEntry })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:userId/education/:educationId', async (req, res) => {
    const { userId, educationId } = req.params

    if (!mongoose.Types.ObjectId.isValid(educationId)) {
        return res.status(400).json({ message: 'Invalid education ID' })
    }

    try {
        const user = await User.findOneAndUpdate(
            { userId: parseInt(userId), 'education._id': educationId },
            {
                $set: {
                    'education.$': {
                        ...req.body,
                        _id: educationId
                    }
                }
            },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: 'User or education entry not found' })

        const updatedEducation = user.education.find(ed => ed._id.toString() === educationId)

        res.json({ message: 'Education updated successfully', updatedEducation })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:userId/education/:educationId', async (req, res) => {
    const { userId, educationId } = req.params;

    try {
        const user = await User.findOneAndUpdate(
            { userId: parseInt(userId) },
            { $pull: { education: { _id: educationId } } },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: 'User or education not found' })

        res.json({ message: 'Education deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router

