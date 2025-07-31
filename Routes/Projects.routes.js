import express from 'express'
import User from '../Model/User.model.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/:userId/projects', async (req, res) => {
  const { userId } = req.params

  try {
    const projectEntry = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $push: { projects: projectEntry } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(201).json({ message: 'Project added', projectEntry })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:userId/projects/:projectId', async (req, res) => {
  const { userId, projectId } = req.params

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: 'Invalid project ID' })
  }

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId), 'projects._id': projectId },
      {
        $set: {
          'projects.$': {
            ...req.body,
            _id: projectId
          }
        }
      },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or project entry not found' })

    const updatedProject = user.projects.find(p => p._id.toString() === projectId)

    res.json({ message: 'Project updated successfully', updatedProject })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:userId/projects/:projectId', async (req, res) => {
  const { userId, projectId } = req.params

  try {
    const user = await User.findOneAndUpdate(
      { userId: parseInt(userId) },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User or project not found' })

    res.json({ message: 'Project deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


export default router