import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../../../middleware/auth';
import { analyzeImage } from '../../../services/ai.service';
import { processImage } from '../../../utils/image.processor';
import History from '../../../models/History';

const router = express.Router();

const uploadsDir = path.join(__dirname, '../../../../uploads');
const processedDir = path.join(__dirname, '../../../../processed');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
  },
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const imageBuffer = req.file.buffer;
    const filename = `${Date.now()}_${req.file.originalname}`;
    const uploadPath = path.join(uploadsDir, filename);
    fs.writeFileSync(uploadPath, imageBuffer);
    const aiResult = await analyzeImage(imageBuffer, req.file.mimetype);
    const processedPath = await processImage(imageBuffer, aiResult.preset.adjustments, processedDir, filename);
    const processedFilename = path.basename(processedPath);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = {
      image_analysis: aiResult.image_analysis,
      preset: aiResult.preset,
      caption: aiResult.caption,
      hashtags: aiResult.hashtags,
      original_image_url: `${baseUrl}/uploads/${filename}`,
      processed_image_url: `${baseUrl}/processed/${processedFilename}`,
    };
    // Save to history
    await History.create({
      user: req.user.id,
      ...result,
    });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export const analyzeRouter = router;
