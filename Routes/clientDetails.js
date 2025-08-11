import mongoose from 'mongoose'
import express from 'express'
import Client from '../Model/Client.model.js';

const router = express.Router()

router.post('/:clientId/client-details', async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findOneAndUpdate(
      { clientId: parseInt(clientId) },
      { $set: { clientDetails: req.body } }, // ✅ set object directly
      { new: true }
    );

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(201).json({ message: 'Client details added', clientDetails: client.clientDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:clientId/client-details', async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findOne({ clientId: parseInt(clientId) });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    client.clientDetails = {
      ...client.clientDetails,
      ...req.body // ✅ merge with existing fields
    };

    await client.save();

    res.json({ message: 'Client details updated successfully', clientDetails: client.clientDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
