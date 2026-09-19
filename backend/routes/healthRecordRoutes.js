const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} = require('../controllers/healthRecordController');

router.use(protect);

router.get('/', getHealthRecords);
router.post('/', createHealthRecord);
router.put('/:id', updateHealthRecord);
router.delete('/:id', deleteHealthRecord);

module.exports = router;
