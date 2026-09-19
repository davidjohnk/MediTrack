const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// This handler runs after multer has already saved the file to /uploads.
// We just record its metadata (name, type, size, path) in the database.
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const document = await Document.create({
      user: req.user.id,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      filePath: req.file.filename,
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    if (document.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', document.filePath);
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Could not remove file from disk:', err.message);
    });

    await document.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
