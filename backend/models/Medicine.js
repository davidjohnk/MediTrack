const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    time: { type: String },
    instructions: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);
