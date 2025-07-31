
// import express from 'express'
// import multer from 'multer';
// import pdfParse from 'pdf-parse'
// import fs from 'fs/promises';
// import parseResumeText from '../Utilities/utility.js';

// const upload = multer({ dest: 'uploads/' })

// const router = express.Router()

// router.post('/upload', upload.single('resume'), async (req, res) => {
//     try {
//         const dataBuffer = await fs.readFile(req.file.path);

//         const pdfData = await pdfParse(dataBuffer);

//         const parsedData = parseResumeText(pdfData.text)

//         res.json({
//             success: true,
//             text: parsedData
//         });

//         await fs.unlink(req.file.path);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to parse PDF resume.' });
//     }
// });

// export default router;