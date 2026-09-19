const HealthRecord = require('../models/HealthRecord');

exports.getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.create({ ...req.body, user: req.user.id });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Health record not found' });
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this record' });
    }
    Object.assign(record, req.body);
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Health record not found' });
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }
    await record.deleteOne();
    res.json({ message: 'Health record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
