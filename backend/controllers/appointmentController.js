const Appointment = require('../models/Appointment');

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user: req.user.id });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this appointment' });
    }
    Object.assign(appointment, req.body);
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
