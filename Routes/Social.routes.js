import express from 'express'
import mongoose from 'mongoose'
import User from '../Model/User.model.js'

const router = express.Router()

router.post('/:userId/socials', async (req, res) => {
  const { userId } = req.params

  try {
    const socialEntry = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    }

    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $push: { socials: socialEntry } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(201).json({ message: 'Social link added', socialEntry })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:userId/socials/:socialId', async (req, res) => {
  const { userId, socialId } = req.params

  if (!mongoose.Types.ObjectId.isValid(socialId)) {
    return res.status(400).json({ message: 'Invalid social ID' })
  }

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId), 'socials._id': socialId },
      {
        $set: {
          'socials.$': {
            ...req.body,
            _id: socialId
          }
        }
      },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or social link not found' })

    const updatedSocial = user.socials.find(s => s._id.toString() === socialId)

    res.json({ message: 'Social link updated', updatedSocial })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:userId/socials/:socialId', async (req, res) => {
  const { userId, socialId } = req.params

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $pull: { socials: { _id: socialId } } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or social link not found' })

    res.json({ message: 'Social link deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
