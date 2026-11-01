const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadStatement } = require('../controllers/uploadController');
// const { authenticate } = require('../middleware/auth'); // Optional: enforce auth

// Configure Multer for local temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the uploads directory exists
    const dir = path.join(__dirname, '../../uploads');
    const fs = require('fs');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Route: POST /api/upload/statement
// We can add the authenticate middleware here later
router.post('/statement', upload.single('statement'), uploadStatement);

module.exports = router;
