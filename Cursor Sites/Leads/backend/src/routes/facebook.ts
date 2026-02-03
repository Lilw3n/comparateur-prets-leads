import express from 'express';
import {
  connectPage,
  publishPost,
  getPosts,
  syncPostMetrics,
  getLeads,
  importLead
} from '../controllers/facebookController';

const router = express.Router();

// Routes pour Facebook
router.post('/connect', connectPage);
router.post('/posts', publishPost);
router.get('/posts', getPosts);
router.post('/posts/:postId/sync', syncPostMetrics);
router.get('/leads', getLeads);
router.post('/leads/:leadId/import', importLead);

export default router;
