const Medicine = require('../models/Medicine');

// GET /api/medicines - only this user's medicines
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/medicines
exports.createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({ ...req.body, user: req.user.id });
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/medicines/:id
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this medicine' });
    }
    Object.assign(medicine, req.body);
    await medicine.save();
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/medicines/:id
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this medicine' });
    }
    await medicine.deleteOne();
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
