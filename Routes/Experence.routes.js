import express from 'express'
import User from '../Model/User.model.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/:userId/experience', async (req, res) => {
  const { userId } = req.params

  try {
    const experienceEntry = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $push: { experience: experienceEntry } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(201).json({ message: 'Experience added', experienceEntry })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:userId/experience/:experienceId', async (req, res) => {
  const { userId, experienceId } = req.params

  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    return res.status(400).json({ message: 'Invalid experience ID' })
  }

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId), 'experience._id': experienceId },
      {
        $set: {
          'experience.$': {
            ...req.body,
            _id: experienceId
          }
        }
      },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or experience entry not found' })

    const updatedExperience = user.experience.find(e => e._id.toString() === experienceId)

    res.json({ message: 'Experience updated successfully', updatedExperience })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:userId/experience/:experienceId', async (req, res) => {
  const { userId, experienceId } = req.params

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $pull: { experience: { _id: experienceId } } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or experience not found' })

    res.json({ message: 'Experience deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
