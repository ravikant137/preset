import express from 'express';
import { authenticate } from '../../../middleware/auth';
import History from '../../../models/History';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await History.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export const historyRouter = router;
