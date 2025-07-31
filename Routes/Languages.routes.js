import express from 'express'
import User from '../Model/User.model.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/:userId/language', async (req, res) => {
  const { userId } = req.params

  try {
    const languageEntry = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $push: { language: languageEntry } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(201).json({ message: 'Language added', languageEntry })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:userId/language/:languageId', async (req, res) => {
  const { userId, languageId } = req.params

  if (!mongoose.Types.ObjectId.isValid(languageId)) {
    return res.status(400).json({ message: 'Invalid language ID' })
  }

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId), 'language._id': languageId },
      {
        $set: {
          'language.$': {
            ...req.body,
            _id: languageId
          }
        }
      },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or language entry not found' })

    const updatedLanguage = user.language.find(l => l._id.toString() === languageId)

    res.json({ message: 'Language updated successfully', updatedLanguage })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:userId/language/:languageId', async (req, res) => {
  const { userId, languageId } = req.params

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $pull: { language: { _id: languageId } } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or language not found' })

    res.json({ message: 'Language deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
