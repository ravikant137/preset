import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './utils/db';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './api/v1/endpoints/auth';
import { analyzeRouter } from './api/v1/endpoints/analyze';
import { historyRouter } from './api/v1/endpoints/history';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;


// Security
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});
app.use(limiter);


// Static files (processed images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/processed', express.static(path.join(__dirname, '../processed')));
app.use(express.static(path.join(__dirname, '../public')));

// Serve frontend for all non-API routes
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Connect DB
connectDB();

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/analyze', analyzeRouter);
app.use('/api/v1/history', historyRouter);

// Error handler
app.use(errorHandler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
