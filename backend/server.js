import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initializeCache } from './services/cacheService.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import tracksRouter from './routes/tracks.js';
import mixRouter from './routes/mix.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/tracks', tracksRouter);
app.use('/mix', mixRouter);
app.use('/stats', statsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/music_mood_dj';
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  await initializeCache();

  const port = process.env.PORT || 5000;
  
  const server = app.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`✗ Port ${port} is already in use`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
