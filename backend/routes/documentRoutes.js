const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/auth');
const {
  getDocuments,
  uploadDocument,
  deleteDocument,
} = require('../controllers/documentController');

// Configure where uploaded files are stored and how they're named.
// NOTE: this is a simple local-disk demo setup, fine for learning, not for production
// or for storing real sensitive medical documents.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

router.use(protect);

router.get('/', getDocuments);
router.post('/', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
