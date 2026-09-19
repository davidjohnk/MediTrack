require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (e.g. http://localhost:5000/uploads/filename.pdf)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple health check route, useful for testing the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediTrack API is running' });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/documents', documentRoutes);

// Catch-all error handler (keeps the server from crashing on unexpected errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MediTrack API server running on port ${PORT}`));
