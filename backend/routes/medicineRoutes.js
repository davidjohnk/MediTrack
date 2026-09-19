const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require('../controllers/medicineController');

router.use(protect); // every route below requires a valid login

router.get('/', getMedicines);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

module.exports = router;
