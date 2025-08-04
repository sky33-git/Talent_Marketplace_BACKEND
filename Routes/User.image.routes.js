
import { PutObjectCommand } from '@aws-sdk/client-s3'
import express from 'express'
import multer from 'multer'
import s3 from '../Config/config.js'

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})

router.post("/upload-image", upload.single("image"), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" })
        }
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `photos/${Date.now()}_${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)
        await s3.send(command)

        const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`

        res.json({
            imageUrl
        })
        console.log(imageUrl);

    } catch (err) {
        console.error("UPLOAD ERROR:", err)
        res.status(500).json({ error: "Upload failed: " + err.message })
    }
})

export default router;