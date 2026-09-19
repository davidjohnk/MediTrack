const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    doctor: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
