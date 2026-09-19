require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

app.disable('x-powered-by');

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files (e.g. http://localhost:5000/uploads/filename.pdf)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ app: 'MediTrack API', status: 'online' });
});

// Simple health check route, useful for testing the server is alive
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MediTrack API is running',
    timestamp: new Date().toISOString(),
  });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/documents', documentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MediTrack API server running on port ${PORT}`));
