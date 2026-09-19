const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
