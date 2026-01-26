import express from 'express';
import {
  getAllArticles,
  getArticleBySlug,
  generateArticle,
  generateFromLeadId,
  generateFromComparisonId,
  updateArticle,
  deleteArticle,
  getArticleStats,
  getRelatedArticles,
  incrementViews,
  likeArticle
} from '../controllers/articleController';

const router = express.Router();

// Get all articles with filters
router.get('/', getAllArticles);

// Get article statistics
router.get('/stats', getArticleStats);

// Generate article from user data
router.post('/generate', generateArticle);

// Generate article from lead ID
router.post('/generate-from-lead/:leadId', generateFromLeadId);

// Generate article from comparison ID
router.post('/generate-from-comparison/:comparisonId', generateFromComparisonId);

// Get related articles
router.get('/related/:slug', getRelatedArticles);

// Increment views
router.post('/:slug/views', incrementViews);

// Like article
router.post('/:slug/like', likeArticle);

// Get article by slug
router.get('/:slug', getArticleBySlug);

// Update article
router.put('/:id', updateArticle);

// Delete article
router.delete('/:id', deleteArticle);

export default router;
