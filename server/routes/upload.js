// server/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Storage config (memory or disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/upload
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // You can access the file with: req.file.buffer
    console.log('Received file:', req.file.originalname);

    res.json({ message: 'File received', fileName: req.file.originalname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
