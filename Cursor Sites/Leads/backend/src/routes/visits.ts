import express from 'express';
import {
  trackVisit,
  getStats,
  getDailyStats
} from '../controllers/visitsController';

const router = express.Router();

// Routes pour les visites
router.post('/', trackVisit);
router.get('/stats', getStats);
router.get('/stats/daily', getDailyStats);

export default router;
