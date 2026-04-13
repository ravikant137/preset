import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { analyzeImage } from './services/ai.service';
import { processImage } from './utils/image.processor';
import { APIResponse, ProcessResult } from '../../shared/types';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Storage setup
const uploadsDir = path.join(__dirname, '../uploads');
const processedDir = path.join(__dirname, '../processed');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
  },
});

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use('/processed', express.static(processedDir));

// Routes
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const imageBuffer = req.file.buffer;
    const filename = `${Date.now()}_${req.file.originalname}`;
    const uploadPath = path.join(uploadsDir, filename);

    // Save original image
    fs.writeFileSync(uploadPath, imageBuffer);

    // 1. Analyze image using AI
    const aiResult = await analyzeImage(imageBuffer, req.file.mimetype);

    // 2. Apply preset using Sharp
    const processedPath = await processImage(
      imageBuffer,
      aiResult.preset.adjustments,
      processedDir,
      filename
    );

    const processedFilename = path.basename(processedPath);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result: ProcessResult = {
      image_analysis: aiResult.image_analysis,
      preset: aiResult.preset,
      caption: aiResult.caption,
      hashtags: aiResult.hashtags,
      original_image_url: `${baseUrl}/uploads/${filename}`,
      processed_image_url: `${baseUrl}/processed/${processedFilename}`,
    };

    const response: APIResponse<ProcessResult> = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
